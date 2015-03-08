module.exports = {


  friendlyName: 'Group user',


  description: 'Associate a user with a group, like an account or an organization.',


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
      description: 'A unique identifier for the user who performed this action.',
      moreInfoUrl: 'https://segment.com/docs/spec/identify#identities',
      example: '019mr8mf4r',
      required: true
    },

    groupId: {
      description: 'A unique identifier for the group who this user is categorized as.',
      moreInfoUrl: 'https://segment.com/docs/spec/group#groupId',
      example: '8e9df332ac',
      required: true
    },

    traits: {
      typeclass: 'dictionary',
      description: 'A free-form dictionary of traits about the user, like "email" or "name".',
      extendedDescription: 'Certain trait keys like "email" or "name" have special meaning in Segment.  See the "Traits field docs" on Segment\'s website for a list of special trait keys.',
      moreInfoUrl: 'https://segment.com/docs/spec/group#traits',
      required: true
    },

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
    }

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

    api.group({
      userId: inputs.userId,
      groupId: inputs.groupId,
      traits: inputs.traits||{},
      integrations: inputs.integrations||{
        All: true,
        Marketo: false,
        Salesforce: false
      }
    }, function(err, batch) {
      if (err) return exits.error(err);
      return exits.success();
    });
  },



};
