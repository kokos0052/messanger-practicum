import { h, Block } from '../../core/index'
import { Field, Button } from '../../blocks/index'
import { TAuthProps } from './types'

function goToLink(link: string) {
  window.location.href = link
}

export class AuthBlock extends Block<TAuthProps> {
  render() {
    if (this.props.formType === 'loginForm') {
      return (
        <main class="centered-content-container">
          <form class="form-container">
            <h3 class="header">Вход</h3>
            <Field type="text" id="login" name="login" label="Логин" />
            <Field
              type="password"
              id="password"
              name="password"
              label="Пароль"
              validators={[{ minLength: 6 }]}
            />
            <div class="button-container button-container-auth__login">
              <Button variant="primary" label="Авторизоваться" />
              <Button
                variant="secondary"
                label="Нет аккаунта?"
                onClick={() => goToLink('/signUp')}
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
          <Field type="text" id="mail" name="email" label="Почта" />
          <Field type="text" id="login" name="login" label="Логин" />
          <Field type="text" id="name" name="first_name" label="Имя" />
          <Field type="text" id="sername" name="second_name" label="Фамилия" />
          <Field type="text" id="phone" name="phone" label="Телефон" />
          <Field type="password" id="password" name="password" label="Пароль" />
          <Field
            type="password"
            id="passwordtwo"
            name="password"
            label="Пароль (еще раз)"
          />
          <div class="button-container button-container-auth__signin">
            <Button variant="primary" label="Авторизоваться" />
            <Button
              variant="secondary"
              label="Войти"
              onClick={() => goToLink('/login')}
            />
          </div>
        </form>
      </main>
    )
  }
}
