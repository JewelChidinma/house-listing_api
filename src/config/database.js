// require('dotenv').config();

// // Simple in-memory database - no external dependencies
// class MockDatabase {
//   constructor() {
//     this.users = [];
//     this.listings = [];
//     this.isConnected = false;
//   }

//   async authenticate() {
//     this.isConnected = true;
//     return Promise.resolve();
//   }

//   async sync() {
//     // Mock sync - just resolve
//     return Promise.resolve();
//   }

//   // Mock Sequelize-like interface
//   define(modelName, attributes, options = {}) {
//     return {
//       modelName,
//       attributes,
//       options,
//       create: async (data) => {
//         const id = Date.now().toString();
//         const record = { id, ...data, created_at: new Date(), updated_at: new Date() };
        
//         if (modelName === 'User') {
//           this.users.push(record);
//         } else if (modelName === 'Listing') {
//           this.listings.push(record);
//         }
        
//         return record;
//       },
//       findOne: async (query) => {
//         const collection = modelName === 'User' ? this.users : this.listings;
//         return collection.find(item => {
//           if (query.where.id) return item.id === query.where.id;
//           if (query.where.email) return item.email === query.where.email;
//           return false;
//         }) || null;
//       },
//       findAll: async (query = {}) => {
//         const collection = modelName === 'User' ? this.users : this.listings;
//         return collection.slice();
//       },
//       update: async (data, query) => {
//         const collection = modelName === 'User' ? this.users : this.listings;
//         const index = collection.findIndex(item => item.id === query.where.id);
//         if (index !== -1) {
//           Object.assign(collection[index], data, { updated_at: new Date() });
//           return [1];
//         }
//         return [0];
//       },
//       destroy: async (query) => {
//         const collection = modelName === 'User' ? this.users : this.listings;
//         const index = collection.findIndex(item => item.id === query.where.id);
//         if (index !== -1) {
//           collection.splice(index, 1);
//           return 1;
//         }
//         return 0;
//       }
//     };
//   }
// }

// const sequelize = new MockDatabase();

// module.exports = sequelize;

require('dotenv').config();

// Simple in-memory database - no external dependencies
class MockDatabase {
  constructor() {
    this.users = [];
    this.listings = [];
    this.isConnected = false;
  }

  async authenticate() {
    this.isConnected = true;
    return Promise.resolve();
  }

  async sync() {
    // Mock sync - just resolve
    return Promise.resolve();
  }

  // Mock Sequelize-like interface
  define(modelName, attributes, options = {}) {
    // Store reference to the database instance
    const db = this;
    
    return {
      modelName,
      attributes,
      options,
      create: async (data) => {
        const id = data.id || Date.now().toString();
        const record = { id, ...data, created_at: new Date(), updated_at: new Date() };
        
        if (modelName === 'User') {
          db.users.push(record);
          console.log(`Created user: ${record.email}, total users: ${db.users.length}`);
        } else if (modelName === 'Listing') {
          db.listings.push(record);
          console.log(`Created listing: ${record.title}, total listings: ${db.listings.length}`);
        }
        
        return record;
      },
      findOne: async (query) => {
        const collection = modelName === 'User' ? db.users : db.listings;
        return collection.find(item => {
          if (query.where.id) return item.id === query.where.id;
          if (query.where.email) return item.email === query.where.email;
          return false;
        }) || null;
      },
      findAll: async (query = {}) => {
        const collection = modelName === 'User' ? db.users : db.listings;
        console.log(`FindAll called for ${modelName}, returning ${collection.length} items`);
        return collection.slice();
      },
      update: async (data, query) => {
        const collection = modelName === 'User' ? db.users : db.listings;
        const index = collection.findIndex(item => item.id === query.where.id);
        if (index !== -1) {
          Object.assign(collection[index], data, { updated_at: new Date() });
          return [1];
        }
        return [0];
      },
      destroy: async (query) => {
        const collection = modelName === 'User' ? db.users : db.listings;
        const index = collection.findIndex(item => item.id === query.where.id);
        if (index !== -1) {
          collection.splice(index, 1);
          return 1;
        }
        return 0;
      }
    };
  }
}

const sequelize = new MockDatabase();

module.exports = sequelize;