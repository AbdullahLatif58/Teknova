import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export const renderTemplate = (templateName: string, context: Record<string, any>) => {
  // Updated path to your actual templates folder
  const filePath = path.join(__dirname, '..', 'notifications', 'templates', `${templateName}.hbs`);
  const templateContent = fs.readFileSync(filePath, 'utf-8');
  const template = Handlebars.compile(templateContent);
  return template(context);
};