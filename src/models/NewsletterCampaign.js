
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const NewsletterCampaign = sequelize.define('NewsletterCampaign', {
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  recipients: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  recipientsCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'saved'
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

export default NewsletterCampaign;
