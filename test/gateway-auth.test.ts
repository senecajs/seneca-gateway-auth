
import GatewayAuth from '../src/gateway-auth'

const Seneca = require('seneca')
const SenecaMsgTest = require('seneca-msg-test')
const GatewayAuthMessages = require('./gateway-auth.messages').default



describe('gateway-auth', () => {

  test('happy', async () => {
    const seneca = Seneca({ legacy: false }).test().use('promisify').use(GatewayAuth)
    await seneca.ready()
  })

  test('messages', async () => {
    const seneca = Seneca({ legacy: false }).test().use('promisify').use(GatewayAuth)
    await (SenecaMsgTest(seneca, GatewayAuthMessages)())
  })

  test('options', async () => {
    const hooks: string[] = []
    const seneca = Seneca({ legacy: false }).test().use('promisify')
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

})

