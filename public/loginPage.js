'use strict';

const userForm = new UserForm();

userForm.loginFormCallback = data => 
  ApiConnector.login(data, response => {
    if (response.success) 
      location.reload();
    else
      alert(response.data);
  });

userForm.registerFormCallback = data =>
  ApiConnector.register(data, response => {
    if ((response.success === undefined) || response.success) // Почему-то при успешном выполнении response.success отсутствует
      location.reload();
    else
      alert(response.data);
  });