const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                return User.findOne({_id: context.user._id});
            }
            throw new AuthenticationError('You need to be logged in');
        },
    },
    // create the user and assign a json webtoken
    Mutation: {
        addUser: async (parent, { username, email, password}) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return ({token, user});
        },
        loginUser: async (parent, { email, password}) => {
            const user = await User.findOne({ email });
            if(!user){
                throw new AuthenticationError('No user found')
            }
            const token = signToken(user);
            return ({token, user});
        },
        saveBook: async (parent, {bookData}, context) => {
            if (context.user){
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {savedBooks: bookData}},
                    {new: true, runValidators: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('you need to be logged in!');
        },
        // return the updated object instead of the original.
        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId: bookId}}},
                    {new: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('you need to be logged in');
        },
    },
};

module.exports = resolvers;