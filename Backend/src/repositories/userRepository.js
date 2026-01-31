const BaseRepository = require('./baseRepository');
const User = require('../models/User');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email, options = {}) {
    const query = this.model.findOne({ email: email.toLowerCase() });
    
    if (options.selectPassword) {
      query.select('+password');
    }
    
    if (options.selectRefreshTokens) {
      query.select('+refreshTokens');
    }
    
    return query.exec();
  }

  async findActiveUsers(options = {}) {
    return this.find({ isActive: true }, options);
  }

  async updateLastLogin(userId) {
    return this.update(userId, { lastLogin: new Date() });
  }

  async addRefreshToken(userId, tokenData) {
    return this.model.findByIdAndUpdate(
      userId,
      { $push: { refreshTokens: tokenData } },
      { new: true }
    );
  }

  async removeRefreshToken(userId, token) {
    return this.model.findByIdAndUpdate(
      userId,
      { $pull: { refreshTokens: { token } } },
      { new: true }
    );
  }

  async removeAllRefreshTokens(userId) {
    return this.update(userId, { refreshTokens: [] });
  }

  async cleanupExpiredTokens(userId) {
    return this.model.findByIdAndUpdate(
      userId,
      { $pull: { refreshTokens: { expiresAt: { $lt: new Date() } } } },
      { new: true }
    );
  }

  async findByRole(role, options = {}) {
    return this.find({ role }, options);
  }

  async updateRole(userId, role) {
    return this.update(userId, { role });
  }

  async toggleActive(userId) {
    const user = await this.findById(userId);
    if (!user) return null;
    
    return this.update(userId, { isActive: !user.isActive });
  }

  async addAddress(userId, addressData) {
    return this.model.findByIdAndUpdate(
      userId,
      { $push: { addresses: addressData } },
      { new: true }
    );
  }

  async updateAddress(userId, addressId, addressData) {
    return this.model.findOneAndUpdate(
      { _id: userId, 'addresses._id': addressId },
      { $set: { 'addresses.$': addressData } },
      { new: true }
    );
  }

  async removeAddress(userId, addressId) {
    return this.model.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );
  }

  async getStatistics() {
    const stats = await this.model.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          newUsersToday: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', new Date(Date.now() - 24 * 60 * 60 * 1000)] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    return stats[0] || { totalUsers: 0, activeUsers: 0, newUsersToday: 0 };
  }
}

module.exports = new UserRepository();
