module.exports = {


  friendlyName: 'Identify user',


  idempotent: true,


  description: 'Identify a user by her unique id and a set of associated traits.',


  extendedDescription: '',


  inputs: {

    writeKey: {
      example: 'C3ut91L4284abn2VdaJ2813Zc193042Kl4',
      description: 'The "write key" associated with your Segment account.',
      whereToGet: {
        url: 'https://segment.com/treeline/treeline.io/settings/keys',
        instructions: 'Copy and paste the "WRITE KEY" from the "API Keys" page in your Segment dashboard.'
      },
      required: true
    },

    userId: {
      description: 'A unique identifier for the user being identified.',
      extendedDescription: 'Generally this comes from a trusted source, like your database.',
      moreInfoUrl: 'https://segment.com/docs/spec/identify#identities',
      example: '019mr8mf4r',
      required: true
    },

    traits: {
      typeclass: 'dictionary',
      description: 'A free-form dictionary of traits about the group, like "employees" or "industry".',
      extendedDescription: 'Certain trait keys like "email" or "name" have special meaning in Segment.  See the "Traits field docs" on Segment\'s website for a list of special trait keys.',
      moreInfoUrl: 'https://segment.com/docs/spec/identify#traits',
      required: true
      // address: -----,
      // age: -----,
      // avatar: -----,
      // birthday: -----,
      // createdAt: -----,
      // description: -----,
      // email: -----,
      // gender: -----,
      // name: -----,
      // phone: -----,
      // title: -----,
      // username: -----,
      // website: -----
    },

    // TODO: consider wiping this out entirely
    // context: {
    //   typeclass: 'dictionary',
    //   description: 'A dictionary of extra information that provides useful context about a message, but is not directly related to the API call.',
    //   extendedDescription: 'For example ip address or locale.',
    //   moreInfoUrl: 'https://segment.com/docs/spec/common#context'
    // },

    integrations: {
      typeclass: 'dictionary',
      description: 'A dictionary of Segment integrations to either enable or disable.',
      extendedDescription: '"All" is a special key that applies when no key for a specific integration is found. This input defaults "All" to true, and "Salesforce" and "Marketo" to false. This is because these integrations have strict limits on API calls, and you don\'t want to run over your limits by accident.',
      moreInfoUrl: 'https://segment.com/docs/spec/common#integrations',
      defaultsTo: {
        All: true,
        Salesforce: false,
        Marketo: false
      }
    },

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
    },

  },


  fn: function (inputs,exits) {
    var SegmentIO = require('analytics-node');
    var api = new SegmentIO(inputs.writeKey);

    api.identify({
      userId: inputs.userId,
      traits: inputs.traits||{},
      // context: inputs.context||{},
      integrations: inputs.integrations||{
        All: true,
        Marketo: false,
        Salesforce: false
      }
    }, function(err, batch){
      if (err) return exits.error(err);
      return exits.success();
    });

  },



};
