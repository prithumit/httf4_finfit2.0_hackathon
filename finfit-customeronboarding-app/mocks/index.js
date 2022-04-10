const details = require('./data.json');

const formSchema = {
  schema: {
    postCode: {
      type: 'text',
      label: 'Postleitzahl',
      flex: {
        xs: 12,
        sm: 6,
        lg: 6,
      },
      rules: [
        'required', 'maxLen(20)',
      ],
    },
    houseNumber: {
      type: 'text',
      label: 'Haus Nummer',
      flex: {
        xs: 12,
        sm: 6,
        lg: 6,
      },
      rules: [
        'required',
      ],
    },
    houseName: {
      type: 'text',
      label: 'Haus Name',
      flex: {
        xs: 12,
        sm: 6,
        lg: 6,
      },
      rules: [
        'required',
      ],
    },
    streetName: {
      type: 'text',
      label: 'Straße Name',
      selected: 0,
      flex: {
        xs: 12,
        sm: 6,
        lg: 6,
      },
      rules: [
        'required',
      ],
    },
    streetAddress: {
      type: 'text',
      label: 'Straße Adresse',
      flex: {
        xs: 12,
        sm: 6,
        lg: 6,
      },
      rules: [
        'required',
      ],
    },
    dateOfBirth: {
      type: 'calendar',
      label: 'Date of Birth',
      color: 'primaryColor',
      placeholder: 'DD-MM-YYYY',
      format: 'DD-MM-YYYY',
      'data-format': 'date',
      'data-qa': 'dateOfBirth',
      regex: '^\\d{2}-\\d{2}-\\d{4}$',
      mask: 'XX-XX-XXXX',
      fieldValidation: true,
      flex: {
        xs: 12,
        sm: 12,
        lg: 12,
      },
      autocomplete: 'off',
      rules: [
        'required',
        'dateValidation(18,150)',
        'dateFormatValidate',
      ],
    },
    city: {
      type: 'text',
      label: 'Stadt',
      flex: {
        xs: 12,
        sm: 6,
        lg: 6,
      },
      rules: [
        'required',
      ],
    },
  },
  model: {
    postCode: '',
    houseNumber: '',
    houseName: '',
    streetName: '',
    streetAddress: '',
    city: '',
    dateOfBirth: '',
  },
};

const stepsSchemaWithForm = {
  steps: [
    {
      id: 1,
      label: 'Personal Details',
      completed: false,
      desc: 'Description',
      enabled: true,
      mandatory: false,
      locale: 'en_US',
      component: [
        {
          name: 'PhotoCapture',
          label: 'PhotoCapture',
          schemaName: '',
          validation: true,
          validationLabel: 'Enable validation',
        },
        {
          name: 'Form',
          label: 'Personal Details',
          icon: 'mdi-account-circle',
          schemaName: 'PersonalDetails',
          validation: true,
          validationLabel: 'Enable validation',
        },
      ],
    },
    {
      id: 2,
      label: 'Address Details',
      completed: false,
      desc: 'Description',
      enabled: true,
      mandatory: true,
      locale: 'en_US',
      component: [
        {
          name: 'Form',
          label: 'Address Details',
          icon: 'mdi-search-web',
          schemaName: 'AddressDetails',
          validation: true,
          validationLabel: 'Enable validation',
        },
      ],
    },
    {
      id: 3,
      label: 'Additional Information',
      completed: false,
      desc: 'Description',
      enabled: true,
      mandatory: true,
      locale: 'en_US',
      component: [
        {
          name: 'Form',
          label: 'Link Nominated Account',
          icon: 'mdi-bank',
          schemaName: 'NominatedAccountDetails',
          validation: true,
          validationLabel: 'Enable validation',
        },
        {
          name: 'Form',
          label: 'Your Tax Details',
          schemaName: 'TaxDetails',
          isExpandable: true,
          validation: true,
          validationLabel: 'Enable validation',
        },
      ],
    },
    {
      id: 4,
      label: 'Review & Consent',
      completed: false,
      desc: 'Description',
      enabled: true,
      mandatory: false,
      icon: 'mdi-clipboard-check',
      locale: 'en_US',
      component: [
        {
          name: 'Form',
          label: 'Form',
          schemaName: '',
          validation: false,
          validationLabel: 'Enable validation',
        },
      ],
    },
    {
      id: 5,
      label: 'Credentials',
      completed: false,
      desc: 'Description',
      enabled: true,
      mandatory: true,
      icon: 'mdi-search-web',
      locale: 'en_US',
      component: [
        {
          name: 'Form',
          label: 'Form',
          schemaName: '',
          validation: false,
          validationLabel: 'Enable validation',
        },
      ],
    },
  ],
  settings: {
    vertical: false,
  },
};

const stepConfig = {
  config: {
    PersonalDetails: {
      schema: {
        firstName: {
          type: 'text',
          appendIcon: '',
          label: 'First Name',
          flex: {
            xs: 12,
            sm: 6,
            lg: 6,
          },
          rules: [
            'required', 'maxLen(75)',
          ],
        },
        lastName: {
          type: 'text',
          label: 'Last Name',
          flex: {
            xs: 12,
            sm: 6,
            lg: 6,
          },
          rules: [
            'required', 'maxLen(75)',
          ],
        },
        birthDate: {
          type: 'text',
          label: 'Date of Birth',
          'data-type': 'date-picker',
          flex: {
            xs: 12,
            sm: 6,
            lg: 6,
          },
          rules: [
            'required',
          ],
        },
        nationalIdType: {
          type: 'select',
          label: 'National Id Type',
          selected: 0,
          items: ['PASSPORT', 'Driving License', 'Nation ID'],
          flex: {
            xs: 12,
            sm: 6,
            lg: 6,
          },
          rules: [
            'required',
          ],
        },
        nationalIdNumber: {
          type: 'text',
          label: 'National Id Number',
          flex: {
            xs: 12,
            sm: 6,
            lg: 6,
          },
          rules: [
            'required', 'maxLen(50)',
          ],
        },
      },
      model: {
        firstName: '',
        lastName: '',
        birthDate: '',
        nationalIdType: '',
        nationalIdNumber: '',
      },
    },
  },
  name: 'PersonalDetails',
};

const formConfig = {
  componentConfig: {
    PersonalDetails: {
      schema: {
        firstName: {
          type: 'text',
          appendIcon: '',
          label: 'First Name',
          flex: {
            xs: 12,
            sm: 6,
            lg: 6,
          },
          rules: [
            'required', 'maxLen(75)',
          ],
        },
        lastName: {
          type: 'text',
          label: 'Last Name',
          flex: {
            xs: 12,
            sm: 6,
            lg: 6,
          },
          rules: [
            'required', 'maxLen(75)',
          ],
        },
        birthDate: {
          type: 'text',
          label: 'Date of Birth',
          'data-type': 'date-picker',
          flex: {
            xs: 12,
            sm: 6,
            lg: 6,
          },
          rules: [
            'required',
          ],
        },
        nationalIdType: {
          type: 'select',
          label: 'National Id Type',
          selected: 0,
          items: ['PASSPORT', 'Driving License', 'Nation ID'],
          flex: {
            xs: 12,
            sm: 6,
            lg: 6,
          },
          rules: [
            'required',
          ],
        },
        nationalIdNumber: {
          type: 'text',
          label: 'National Id Number',
          flex: {
            xs: 12,
            sm: 6,
            lg: 6,
          },
          rules: [
            'required', 'maxLen(50)',
          ],
        },
      },
      model: {
        firstName: '',
        lastName: '',
        birthDate: '',
        nationalIdType: '',
        nationalIdNumber: '',
      },
    },
  },
  label: 'Personal Details',
  icon: 'mdi-account-circle',
  name: 'PersonalDetails',
};

module.exports = {
  formSchema,
  stepsSchemaWithForm,
  stepConfig,
  formConfig,
  details,
};
