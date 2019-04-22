const newFormatDate = function(information) {
  return information.map(element => {
    element["created_at"] = new Date(element["created_at"]);
    return element;
  });
};

const changeKey = function(list, keyToChange, newKey) {
  const newList = [...list];
  newList.forEach(function(item) {
    item[newKey] = item[keyToChange];
    delete item[keyToChange];
  });
  return newList;
};

module.exports = { newFormatDate, changeKey };
