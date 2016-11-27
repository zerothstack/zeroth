/**
 * @module common
 */
/** End Typedoc Module Declaration */

import * as chalk from 'chalk';

/**
 * Zeroth Banner for usage in cli welcome
 * @type {string}
 */
export const banner = `
    /|       |\\      _
   / /       \\ \\    | |
  / /         \\ \\   | |                            _______   _____
 / /           \\ \\  | |                           |__   __| | ____|
 \`.\`. _______ ,'.'  | |___   _   _____   _   _   _   | |    |___
   \`.\`.-----,'.'    |  _  | | | |  _  | | | | | | |  | |        | |
     \`.\`..,','      | |_| | | | | |_| | | |_| | | |  | |     ___| |
       \`._,'        |_____| |_| |___| | |_____| |_|  |_|    |_____|
                                    | |
                                    | |
                                    | |
                                    |_|`;

export function bannerBg(message: string = '$ Zeroth Runtime CLI', bgString: string): string {

  let shortMessage: string = '';
  let longMessage: string  = '';

  message = ` ${message} `;

  message.length > 36 ? longMessage = message : shortMessage = message;

  shortMessage += "*".repeat(38 - shortMessage.length);

  const template = `
********************************************************************************
**** /| ***** |\\ **** _ ********************************************************
*** / / ***** \\ \\ ** | | *******************************************************
** / / ******* \\ \\ * | | *************************  _______   _____  ***********
* / / ********* \\ \\  | | ************************* |__   __| | ____| ***********
* \`.\`. _______ ,'.'  | |___   _   _____   _   _   _   | | ***|___    ***********
*** \`.\`.-----,'.' ** |  _  | | | |  _  | | | | | | |  | | *******| | ***********
***** \`.\`..,',' **** | |_| | | | | |_| | | |_| | | |  | | ****___| | ***********
******* \`._,' ****** |_____| |_| |___| | |_____| |_|  |_| ** |_____| ***********
*********    *********************** | | ***************************************
************************************ | | ***************************************
************************************ | | *${shortMessage}
************************************ |_| ***************************************
********************************************************************************
${longMessage}`;

  const minReplacementLength = template.match(/\*+/g)
    .join('').length;
  if (bgString.length < minReplacementLength) {
    bgString = bgString.repeat(minReplacementLength / bgString.length + 1);
  }

  return template.replace(/\*+/g, (match: string) => {
    const replacement: string = bgString.substr(0, match.length);

    bgString = bgString.substr(match.length);
    return chalk.gray(replacement);
  });

}
