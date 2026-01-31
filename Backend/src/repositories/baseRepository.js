class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id, options = {}) {
    let query = this.model.findById(id);
    
    if (options.populate) {
      query = query.populate(options.populate);
    }
    
    if (options.select) {
      query = query.select(options.select);
    }
    
    if (options.lean !== false) {
      query = query.lean();
    }
    
    return query.exec();
  }

  async findOne(filter = {}, options = {}) {
    let query = this.model.findOne(filter);
    
    if (options.populate) {
      query = query.populate(options.populate);
    }
    
    if (options.select) {
      query = query.select(options.select);
    }
    
    if (options.lean !== false) {
      query = query.lean();
    }
    
    return query.exec();
  }

  async find(filter = {}, options = {}) {
    let query = this.model.find(filter);
    
    if (options.sort) {
      query = query.sort(options.sort);
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.skip) {
      query = query.skip(options.skip);
    }
    
    if (options.populate) {
      query = query.populate(options.populate);
    }
    
    if (options.select) {
      query = query.select(options.select);
    }
    
    if (options.lean !== false) {
      query = query.lean();
    }
    
    return query.exec();
  }

  async create(data, options = {}) {
    const document = new this.model(data);
    
    if (options.session) {
      return document.save({ session: options.session });
    }
    
    return document.save();
  }

  async insertMany(data, options = {}) {
    return this.model.insertMany(data, options);
  }

  async update(id, data, options = {}) {
    const defaultOptions = { 
      new: true, 
      runValidators: true,
      ...options 
    };
    
    let query = this.model.findByIdAndUpdate(id, data, defaultOptions);
    
    if (options.populate) {
      query = query.populate(options.populate);
    }
    
    return query.exec();
  }

  async updateOne(filter, data, options = {}) {
    const defaultOptions = {
      new: true,
      runValidators: true,
      ...options
    };
    
    return this.model.findOneAndUpdate(filter, data, defaultOptions).exec();
  }

  async updateMany(filter, data, options = {}) {
    return this.model.updateMany(filter, data, { 
      runValidators: true,
      ...options 
    }).exec();
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id).exec();
  }

  async deleteOne(filter) {
    return this.model.findOneAndDelete(filter).exec();
  }

  async deleteMany(filter) {
    return this.model.deleteMany(filter).exec();
  }

  async paginate(filter, options = {}) {
    const defaultOptions = {
      page: 1,
      limit: 20,
      sort: { createdAt: -1 },
      lean: true,
      ...options
    };

    return this.model.paginate(filter, defaultOptions);
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async exists(filter = {}) {
    return this.model.exists(filter);
  }

  async aggregate(pipeline) {
    return this.model.aggregate(pipeline);
  }

  async distinct(field, filter = {}) {
    return this.model.distinct(field, filter);
  }
}

module.exports = BaseRepository;
