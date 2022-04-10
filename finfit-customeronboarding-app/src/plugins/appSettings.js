import getJSONFromFile from '@/_core/helpers/fileUtility';

const Settings = require('@/_config/_app/appConfiguration-en.json');

const appSettings = getJSONFromFile(Settings);

export default appSettings;
