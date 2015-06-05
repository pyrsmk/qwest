module.exports = {
  '/api/users': {
    GET: {
      default: {
        data: [
          { name: 'John' },
          { name: 'Adam' }
        ]
      },
      blank: {
        data: []
      },
      increase: {
        data: [
          { name: 'John' },
          { name: 'Adam' },
          { name: 'Clark' },
          { name: 'Earl' }
        ]
      }
    },
    POST: {
      default: {
        data: {
          success: true
        },
        code: 201
      },
      error: {
        code: 405
      }
    },
    DELETE: {
      default: {
        data: {
          success: true
        },
        code: 201
      },
      error: {
        code: 405
      }
    },
    PUT: {
      default: {
        data: {
          success: true
        },
        code: 201
      },
      error: {
        code: 405
      }
    }
  },
  '/api/cities': {
    'GET': {
      data: [
        { name: 'New York' },
        { name: 'Miami' }
      ]
    }
  }
};
