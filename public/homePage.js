'use strict';

const logoutButton = new LogoutButton();

logoutButton.action = () => 
  ApiConnector.logout(response => {
    if (response.success)
      location.reload(); 
  });

ApiConnector.current(response => {
  if (response.success)
    ProfileWidget.showProfile(response.data);
});

const ratesBoard = new RatesBoard();

const ratesRequest = () => 
  ApiConnector.getStocks(response => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }    
  });
  
ratesRequest();

setInterval(ratesRequest, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = data =>
  ApiConnector.addMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, `Счёт пополнен на ${data.amount} ${data.currency}`);      
    } else
      moneyManager.setMessage(false, response.data);     
  });
  
moneyManager.conversionMoneyCallback = data =>
  ApiConnector.convertMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, `Выполнена конвертация ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`);      
    } else
      moneyManager.setMessage(false, response.data);     
  });
  
moneyManager.sendMoneyCallback = data =>
  ApiConnector.transferMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, `Выполнен перевод ${data.amount} ${data.currency} пользователю ${data.to}`);      
    } else
      moneyManager.setMessage(false, response.data);     
  });
  
const favoritesWidget = new FavoritesWidget();

const updateFavorites = data => {
  favoritesWidget.clearTable();
  favoritesWidget.fillTable(data);
  moneyManager.updateUsersList(data);  
}

ApiConnector.getFavorites(response => {
  if (response.success)
    updateFavorites(response.data);
});

favoritesWidget.addUserCallback = data =>
  ApiConnector.addUserToFavorites(data, response => {
    if (response.success) {
      updateFavorites(response.data); 
      favoritesWidget.setMessage(true, `Добавлен пользователь ${data.id} с именем ${data.name}`);
    } else
      favoritesWidget.setMessage(false, response.data);
  });
  
favoritesWidget.removeUserCallback = id =>
  ApiConnector.removeUserFromFavorites(id, response => {
    if (response.success) {
      updateFavorites(response.data); 
      favoritesWidget.setMessage(true, `Удалён пользователь ${id}`);
    } else
      favoritesWidget.setMessage(false, response.data);
  });
