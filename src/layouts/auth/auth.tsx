import { h, Block } from '@core/index'
import { Field, Button } from '@blocks/index'
import {
  goToLink,
  PASSWORD_VALIDATORS,
  PHONE_VALIDATORS,
  REQUIRED_VALIDATORS,
} from '@shared/utils'
import { TAuthProps } from './types'

export class AuthBlock extends Block<TAuthProps> {
  constructor(props: TAuthProps) {
    super(props)
  }

  render() {
    if (this.props.formType === 'loginForm') {
      return (
        <main class="centered-content-container">
          <form class="form-container">
            <h3 class="header">Вход</h3>
            <Field
              type="text"
              id="login"
              name="login"
              label="Логин"
              validators={REQUIRED_VALIDATORS}
            />
            <Field
              type="password"
              id="password"
              name="password"
              label="Пароль"
              validators={PASSWORD_VALIDATORS}
            />
            <div class="button-container button-container-auth__login">
              <Button
                variant="primary"
                label="Авторизоваться"
                type="submit"
                disabled
              />
              <Button
                variant="secondary"
                label="Нет аккаунта?"
                onClick={() => goToLink('/sign-up')}
              />
            </div>
          </form>
        </main>
      )
    }

    return (
      <main class="centered-content-container">
        <form class="form-container">
          <h3 class="header">Регистрация</h3>
          <Field
            type="text"
            id="mail"
            name="email"
            label="Почта"
            validators={REQUIRED_VALIDATORS}
          />
          <Field
            type="text"
            id="login"
            name="login"
            label="Логин"
            validators={REQUIRED_VALIDATORS}
          />
          <Field
            type="text"
            id="name"
            name="first_name"
            label="Имя"
            validators={REQUIRED_VALIDATORS}
          />
          <Field
            type="text"
            id="sername"
            name="second_name"
            label="Фамилия"
            validators={REQUIRED_VALIDATORS}
          />
          <Field
            type="tel"
            id="phone"
            name="phone"
            label="Телефон"
            mask="phone"
            validators={PHONE_VALIDATORS}
          />
          <Field
            type="password"
            id="password"
            name="password"
            label="Пароль"
            validators={PASSWORD_VALIDATORS}
          />
          <Field
            type="password"
            id="passwordtwo"
            name="password_two"
            label="Пароль (еще раз)"
            validators={PASSWORD_VALIDATORS}
          />
          <div class="button-container button-container-auth__signin">
            <Button variant="primary" label="Авторизоваться" type="submit" disabled />
            <Button
              variant="secondary"
              label="Войти"
              onClick={() => goToLink('/')}
            />
          </div>
        </form>
      </main>
    )
  }
}
