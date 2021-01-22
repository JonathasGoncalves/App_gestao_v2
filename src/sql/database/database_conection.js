import * as SQLite from 'expo-sqlite';

export const DatabaseConnection = {
  getConnection: () => SQLite.openDatabase("diagnostico_db.db"),
};