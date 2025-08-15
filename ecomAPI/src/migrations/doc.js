'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('AddressUsers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER
            },
            shipName: {
                type: Sequelize.STRING
            },
            shipAdress: {
                type: Sequelize.STRING
            },
            shipEmail: {
                type: Sequelize.STRING
            },
            shipPhonenumber: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            shipChoose: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('AddressUsers');
    }
};
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AffiliateClicks', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      linkId: { 
        type: Sequelize.INTEGER, 
        allowNull: false
      },
      kolId: { 
        type: Sequelize.INTEGER, 
        allowNull: false
      },
      productId: { 
        type: Sequelize.INTEGER, 
        allowNull: false
      },
      ipAddress: { 
        type: Sequelize.STRING(50), 
        allowNull: true, 
        defaultValue: null,
        comment: 'Anonymized IP address'
      },
      userAgent: { 
        type: Sequelize.TEXT, 
        allowNull: true, 
        defaultValue: null,
        comment: 'Browser/device information'
      },
      clickedAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.NOW,
        comment: 'When the click occurred'
      },
      referrerUrl: { 
        type: Sequelize.STRING(255), 
        allowNull: true, 
        defaultValue: null,
        comment: 'Referring URL'
      },
      geoLocation: { 
        type: Sequelize.STRING(255), 
        allowNull: true, 
        defaultValue: null 
      },
      converted: { 
        type: Sequelize.BOOLEAN, 
        allowNull: false, 
        defaultValue: false,
        comment: 'Whether this click led to a conversion'
      },
      conversionId: { 
        type: Sequelize.INTEGER, 
        allowNull: true, 
        defaultValue: null,
        comment: 'Reference to Order model if converted'
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AffiliateClicks');
  }
};
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AffiliateClicks', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      linkId: { 
        type: Sequelize.INTEGER, 
        allowNull: false
      },
      kolId: { 
        type: Sequelize.INTEGER, 
        allowNull: false
      },
      productId: { 
        type: Sequelize.INTEGER, 
        allowNull: false
      },
      ipAddress: { 
        type: Sequelize.STRING(50), 
        allowNull: true, 
        defaultValue: null,
        comment: 'Anonymized IP address'
      },
      userAgent: { 
        type: Sequelize.TEXT, 
        allowNull: true, 
        defaultValue: null,
        comment: 'Browser/device information'
      },
      clickedAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.NOW,
        comment: 'When the click occurred'
      },
      referrerUrl: { 
        type: Sequelize.STRING(255), 
        allowNull: true, 
        defaultValue: null,
        comment: 'Referring URL'
      },
      geoLocation: { 
        type: Sequelize.STRING(255), 
        allowNull: true, 
        defaultValue: null 
      },
      converted: { 
        type: Sequelize.BOOLEAN, 
        allowNull: false, 
        defaultValue: false,
        comment: 'Whether this click led to a conversion'
      },
      conversionId: { 
        type: Sequelize.INTEGER, 
        allowNull: true, 
        defaultValue: null,
        comment: 'Reference to Order model if converted'
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AffiliateClicks');
  }
};
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AffiliateOrders', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      kolId: { 
        type: Sequelize.INTEGER, 
        allowNull: false
      },
      orderId: { 
        type: Sequelize.INTEGER, 
        allowNull: false
      },
      productId: { 
        type: Sequelize.INTEGER, 
        allowNull: false
      },
      linkId: { 
        type: Sequelize.INTEGER, 
        allowNull: false
      },
      revenue: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      commission: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      commissionRate: { 
        type: Sequelize.DECIMAL(5, 2), 
        allowNull: false
      },
      status: { type: Sequelize.ENUM('pending', 'completed', 'cancelled'), allowNull: false },
      confirmedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AffiliateOrders');
  }
};
'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Allcodes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            type: {
                type: Sequelize.STRING
            },
            value: {
                type: Sequelize.STRING
            },
            code: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Allcodes');
    }
};
'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Banners', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.TEXT('long')
            },
            name: {
                type: Sequelize.STRING
            },
            statusId: {
                type: Sequelize.STRING
            },
            image: {
                type: Sequelize.BLOB('long')
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Banners');
    }
};

'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Blogs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            shortdescription: {
                type: Sequelize.TEXT('long')
            },
            title: {
                type: Sequelize.STRING
            },
            subjectId: {
                type: Sequelize.STRING
            },
            statusId: {
                type: Sequelize.STRING
            },
            image: {
                type: Sequelize.BLOB('long')
            },
            contentMarkdown: {
                type: Sequelize.TEXT('long')
            },
            contentHTML: {
                type: Sequelize.TEXT('long')
            },
            userId: {
                type: Sequelize.INTEGER
            },
            view: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Blogs');
    }
};

'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Blogs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            shortdescription: {
                type: Sequelize.TEXT('long')
            },
            title: {
                type: Sequelize.STRING
            },
            subjectId: {
                type: Sequelize.STRING
            },
            statusId: {
                type: Sequelize.STRING
            },
            image: {
                type: Sequelize.BLOB('long')
            },
            contentMarkdown: {
                type: Sequelize.TEXT('long')
            },
            contentHTML: {
                type: Sequelize.TEXT('long')
            },
            userId: {
                type: Sequelize.INTEGER
            },
            view: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Blogs');
    }
};

'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Comments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            content: {
                type: Sequelize.TEXT('long')
            },
            image: {
                type: Sequelize.BLOB('long')
            },
            parentId: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            productId: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            blogId: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            star: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Comments');
    }
};
  'use strict';

  module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('drawkols', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        kolId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users', 
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        reviewId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'users', 
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL', 
        },
        image_bank: {
          type: Sequelize.BLOB('long'), 
          allowNull: true,
        },
        amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM('pending', 'approved', 'rejected', 'completed'),
          allowNull: false,
          defaultValue: 'pending',
        },
        bank_account_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        bank_account_number: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        bank_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        bank_branch: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        withdrawAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        note: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });
    },

    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('drawkols');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_drawkols_status;');
    },
  };

  'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('KolRequests', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      userId: { 
        type: Sequelize.INTEGER, 
        allowNull: false
      },
      status: { type: Sequelize.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
      reason: { type: Sequelize.TEXT, allowNull: true, defaultValue: null },
      socialMediaLinks: { 
        type: Sequelize.JSON, 
        allowNull: true,
        comment: 'JSON object containing social media profile links'
      },
      identificationDocument: { 
        type: Sequelize.JSON, 
        allowNull: true,
        comment: 'JSON object containing ID verification details'
      },
      reviewedBy: { 
        type: Sequelize.INTEGER, 
        allowNull: true,
        comment: 'Staff user ID who reviewed the application'
      },
      reviewDate: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('KolRequests');
  }
};
'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Messages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            text: {
                type: Sequelize.TEXT('long')
            },
            userId: {
                type: Sequelize.INTEGER
            },
            roomId: {
                type: Sequelize.INTEGER
            },
            unRead: {
                type: Sequelize.BOOLEAN
            },
          
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Messages');
    }
};
'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Orderdetails', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            orderId: {
                type: Sequelize.INTEGER
            },
            productId: {
                type: Sequelize.INTEGER
            },
            quantity: {
                type: Sequelize.INTEGER
            },
            realPrice: {
                type: Sequelize.BIGINT
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Orderdetails');
    }
};

'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Orderproducts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            addressUserId: {
                type: Sequelize.INTEGER
            },
            shipperId: {
                type: Sequelize.INTEGER
            },
            statusId: {
                type: Sequelize.STRING
            },
            typeShipId: {
                type: Sequelize.INTEGER
            },
            voucherId: {
                type: Sequelize.INTEGER
            },
            note: {
                type: Sequelize.STRING
            },
            isPaymentOnlien: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            image: {
                type: Sequelize.BLOB('long')
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Orderproducts');
    }
};

'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            contentHTML: {
                type: Sequelize.TEXT('long')
            },
            contentMarkdown: {
                type: Sequelize.TEXT('long')
            },
            statusId: {
                type: Sequelize.STRING
            },
            categoryId: {
                type: Sequelize.STRING
            },
            view: {
                type: Sequelize.INTEGER
            },

            madeby: {
                type: Sequelize.STRING
            },
            material: {
                type: Sequelize.STRING
            },
            brandId: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Products');
    }
};

'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Productdetails', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            productId: {
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.TEXT('long')
            },
            nameDetail: {
                type: Sequelize.STRING
            },

            originalPrice: {
                type: Sequelize.BIGINT
            },
            discountPrice: {
                type: Sequelize.BIGINT
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Productdetails');
    }
};

'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ProductDetailSizes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            productdetailId: {
                type: Sequelize.INTEGER
            },
            width: {
                type: Sequelize.STRING
            },
            height: {
                type: Sequelize.STRING
            },
            weight: {
                type: Sequelize.STRING
            },
            sizeId: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ProductDetailSizes');
    }
};

'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Productimages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            caption: {
                type: Sequelize.STRING
            },
            productdetailId: {
                type: Sequelize.INTEGER
            },
            image: {
                type: Sequelize.BLOB('long')
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Productimages');
    }
};

'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Receipts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER
            },
            supplierId: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Receipts');
    }
};
'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ReceiptDetails', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            receiptId: {
                type: Sequelize.INTEGER
            },
            productDetailSizeId: {
                type: Sequelize.INTEGER
            },
            quantity: {
                type: Sequelize.INTEGER
            },
            price: {
                type: Sequelize.BIGINT
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ReceiptDetails');
    }
};
'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('RoomMessages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userOne: {
                type: Sequelize.INTEGER
            },
            userTwo: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('RoomMessages');
    }
};
'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Shopcarts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER
            },
            productdetailsizeId: {
                type: Sequelize.INTEGER
            },
            quantity: {
                type: Sequelize.INTEGER
            },
            statusId: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Shopcarts');
    }
};

'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Suppliers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            phonenumber: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Suppliers');
    }
};

'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Typeships', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            type: {
                type: Sequelize.STRING
            },
            price: {
                type: Sequelize.BIGINT
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Typeships');
    }
};

'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Typevouchers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            typeVoucher: {
                type: Sequelize.STRING
            },
            value: {
                type: Sequelize.BIGINT
            },
            maxValue: {
                type: Sequelize.BIGINT
            },
            minValue: {
                type: Sequelize.BIGINT
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Typevouchers');
    }
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      genderId: {
        type: Sequelize.STRING
      },
      phonenumber: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.BLOB('long')
      },
      dob: {
        type: Sequelize.STRING
      },
      isActiveEmail: {
        type: Sequelize.BOOLEAN
      },
      roleId: {
        type: Sequelize.STRING
      },
      statusId: {
        type: Sequelize.STRING
      },
      usertoken: {
        type: Sequelize.STRING
      },
      is_kol: {
        type: Sequelize.BOOLEAN
      },
      kol_status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected')
      },
      kol_tier: {
        type: Sequelize.STRING
      },
      kol_commission_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      total_sales: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_followers: {
        type: Sequelize.INTEGER
      },
      facebook_link: {
        type: Sequelize.STRING
      },
      instagram_link: {
        type: Sequelize.STRING
      },
      tiktok_link: {
        type: Sequelize.STRING
      },
      youtube_link: {
        type: Sequelize.STRING
      },
      twitter_link: {
        type: Sequelize.STRING
      },
      other_link: {
        type: Sequelize.STRING
      },
      bank_name: {
        type: Sequelize.STRING
      },
      bank_account_number: {
        type: Sequelize.STRING
      },
      bank_account_name: {
        type: Sequelize.STRING
      },
      bank_branch: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};


'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Vouchers', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            fromDate: {
                type: Sequelize.STRING
            },
            toDate: {
                type: Sequelize.STRING
            },
            typeVoucherId: {
                type: Sequelize.INTEGER
            },
            amount: {
                type: Sequelize.INTEGER
            },
            codeVoucher: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Vouchers');
    }
};

'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Voucheruseds', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            voucherId: {
                type: Sequelize.INTEGER,
                allowNull: false,

            },
            userId: {

                allowNull: false,
                type: Sequelize.INTEGER
            },
            status: {
                allowNull: false,
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Voucheruseds');
    }
};