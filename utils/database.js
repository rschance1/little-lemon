import * as SQLite from 'expo-sqlite';
import { SECTION_LIST_MOCK_DATA } from './utils';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists menuitems (name text primary key, price text, description text, image text, category text);'
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('select * from menuitems', [], (_, { rows }) => {
        resolve(rows._array);
      }, (tx, error) => {
        console.error(error);
      });
    });
  });
}

export async function saveMenuItems(menuItems) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // 2. Implement a single SQL statement to save all menu data in a table called menuitems.
      // Check the createTable() function above to see all the different columns the table has
      // Hint: You need a SQL statement to insert multiple rows at once.
      let sqlStatement = `INSERT INTO menuitems (name,price,description,image,category) VALUES ${menuItems.map((value) => "(?,?,?,?,?)").join(",")}`;
      tx.executeSql(sqlStatement, menuItems.flatMap((value) => [value.name, value.price, value.description, value.image, value.category]), (tx, results) => {
        if (results.rowsAffected > 0 ) {
          console.log('Insert success');              
          resolve();
        } else {
          reject();
        }
      });
    });
  });
}

/**
 * 4. Implement a transaction that executes a SQL statement to filter the menu by 2 criteria:
 * a query string and a list of categories.
 *
 * The query string should be matched against the menu item titles to see if it's a substring.
 * For example, if there are 4 items in the database with titles: 'pizza, 'pasta', 'french fries' and 'salad'
 * the query 'a' should return 'pizza' 'pasta' and 'salad', but not 'french fries'
 * since the latter does not contain any 'a' substring anywhere in the sequence of characters.
 *
 * The activeCategories parameter represents an array of selected 'categories' from the filter component
 * All results should belong to an active category to be retrieved.
 * For instance, if 'pizza' and 'pasta' belong to the 'Main Dishes' category and 'french fries' and 'salad' to the 'Sides' category,
 * a value of ['Main Dishes'] for active categories should return  only'pizza' and 'pasta'
 *
 * Finally, the SQL statement must support filtering by both criteria at the same time.
 * That means if the query is 'a' and the active category 'Main Dishes', the SQL statement should return only 'pizza' and 'pasta'
 * 'french fries' is excluded because it's part of a different category and 'salad' is excluded due to the same reason,
 * even though the query 'a' it's a substring of 'salad', so the combination of the two filters should be linked with the AND keyword
 *
 */
export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      let sqlStatement = `SELECT * FROM menuitems WHERE category IN (${activeCategories.map(e => `'${e}'`).join(",")}) AND name LIKE '%${query}%';`;
      console.log(sqlStatement);
      tx.executeSql(sqlStatement, [], (tx, results) => {
        resolve(results.rows._array);
      }, (tx, error) => {
        console.error(error);
      });
    })
  });
}
