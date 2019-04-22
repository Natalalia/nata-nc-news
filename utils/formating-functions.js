const changeKey = function(list, keyToChange, newKey) {
  const newList = [...list];
  newList.forEach(function(item) {
    item[newKey] = item[keyToChange];
    delete item[keyToChange];
  });
  return newList;
};

module.exports = { changeKey };
