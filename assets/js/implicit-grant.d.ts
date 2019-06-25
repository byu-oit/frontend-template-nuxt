declare const DEFAULT_ISSUER = 'https://api.byu.edu'
/**
 * @typedef {} ImplicitConfig
 * @prop {string} clientId
 * @prop {?string} issuer
 * @prop {?string} callbackUrl
 * @prop {?boolean} requireAuthentication
 */
/**
 *
 * @param {ImplicitConfig} cfg
 */

declare function configure(cfg: any): void
declare function state(state: any, token: any, user: any, error: any): void
declare function startLogin(): void
declare function startLogout(): void
declare function startRefresh(asPopup: boolean): void
declare function handleCurrentInfoRequest({ callback }: { callback: any }): void

export {
  DEFAULT_ISSUER,
  configure,
  startLogin,
  startLogout,
  startRefresh,
  handleCurrentInfoRequest,
  state
}
