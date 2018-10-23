let database;

function inject(newDatabase) {
  database = newDatabase;
}
function get() {
  return {
    database
  };
}

module.exports = {
  inject,
  get
};