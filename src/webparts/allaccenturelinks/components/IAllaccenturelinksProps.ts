import { INavLinkTop } from './INavLink';
import {IQuickLink} from './IQuickLink';

export interface IAllaccenturelinksProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  quickLinks: Array<IQuickLink>;
  navLinks: Array<INavLinkTop>;
}
