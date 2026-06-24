import { h, Block } from '@core/index'
import { Field, Button } from '@blocks/index'
import { TAuthProps } from './types'
import { goToLink } from '@shared/utils'

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
              validators={[{ required: true }]}
            />
            <Field
              type="password"
              id="password"
              name="password"
              label="Пароль"
              validators={[{ required: true }, { minLength: 6 }]}
            />
            <div class="button-container button-container-auth__login">
              <Button variant="primary" label="Авторизоваться" type="submit" />
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
            validators={[{ required: true }]}
          />
          <Field
            type="text"
            id="login"
            name="login"
            label="Логин"
            validators={[{ required: true }]}
          />
          <Field
            type="text"
            id="name"
            name="first_name"
            label="Имя"
            validators={[{ required: true }]}
          />
          <Field
            type="text"
            id="sername"
            name="second_name"
            label="Фамилия"
            validators={[{ required: true }]}
          />
          <Field
            type="text"
            id="phone"
            name="phone"
            label="Телефон"
            validators={[{ required: true }]}
          />
          <Field
            type="password"
            id="password"
            name="password"
            label="Пароль"
            validators={[{ required: true }, { minLength: 6 }]}
          />
          <Field
            type="password"
            id="passwordtwo"
            name="password_two"
            label="Пароль (еще раз)"
            validators={[{ required: true }, { minLength: 6 }]}
          />
          <div class="button-container button-container-auth__signin">
            <Button variant="primary" label="Авторизоваться" type="submit" />
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
