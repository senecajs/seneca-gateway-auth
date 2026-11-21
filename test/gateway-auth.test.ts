import GatewayAuth from '../src/gateway-auth'

const Seneca = require('seneca')
const SenecaMsgTest = require('seneca-msg-test')
const GatewayAuthMessages = require('./gateway-auth.messages').default



describe('gateway-auth', () => {

  test('happy', async () => {
    const seneca = Seneca({ legacy: false }).test().use(GatewayAuth)
    await seneca.ready()
  })

  test('messages', async () => {
    const seneca = Seneca({ legacy: false }).test().use(GatewayAuth)
    await (SenecaMsgTest(seneca, GatewayAuthMessages)())
  })

  test('options', async () => {
    const hooks: string[] = []
    const seneca = Seneca({ legacy: false }).test()
      .add('sys:gateway,add:hook', function(msg: any, reply: any) {
        hooks.push(msg.gateway + '/' + msg.hook)
        reply({ ok: true })
      })
      .use(GatewayAuth, {
        spec: {
          express_cookie: { active: true },
          lambda_cookie: { token: { name: 'my-auth' } },
          lambda_cognito: { user: { require: false } },
        }
      })
    await seneca.ready()

    // Specs that are not given stay out of the options (azure_cookie).
    expect(seneca.find_plugin('gateway_auth').options.spec).toEqual({
      express_cookie: {
        active: true,
        token: { name: 'seneca-auth' },
        user: { auth: true, require: true },
      },
      lambda_cookie: {
        active: false,
        token: { name: 'my-auth' },
        user: { auth: true, require: true },
      },
      lambda_cognito: {
        active: false,
        user: { auth: true, require: false },
      },
    })
    expect(hooks.sort()).toEqual(['express/action', 'express/custom'])
  })

  test('lambda-cookie', async () => {
    const seneca = Seneca({ legacy: false }).test()
      .use('@seneca/gateway')
      .message('sys:user,auth:user', async function(msg: any) {
        return 't1' === msg.token ?
          { ok: true, user: { id: 'u1' }, login: { id: 'l1' } } :
          { ok: false, why: 'token-not-found' }
      })
      .message('foo:1', async function(_msg: any, meta: any) {
        return {
          user: meta.custom.principal.user.id,
          login: meta.custom.principal.login.id,
        }
      })
      .use(GatewayAuth, {
        spec: {
          lambda_cookie: { active: true, token: { name: 'my-auth' } },
        }
      })
    await seneca.ready()

    const handler = seneca.export('gateway/handler')
    const event = (cookie?: string) =>
      ({ event: { headers: null == cookie ? {} : { cookie } } })

    // The cookie identifies the user, who is the principal of the message.
    let res = await handler({ foo: 1 }, event('a=b; my-auth=t1'))
    expect(res.error).toEqual(false)
    expect(res.out).toMatchObject({ user: 'u1', login: 'l1' })

    // Without a valid cookie the message is refused with a 401 status.
    res = await handler({ foo: 1 }, event())
    expect(res).toEqual({ ok: false, why: 'no-user', gateway$: { status: 401 } })

    res = await handler({ foo: 1 }, event('my-auth=t2'))
    expect(res).toEqual({ ok: false, why: 'no-user', gateway$: { status: 401 } })
  })

})
