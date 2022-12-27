import * as React from "react";
import styles from "./Allaccenturelinks.module.scss";
import { IAllaccenturelinksProps } from "./IAllaccenturelinksProps";

interface LinkListProps {
  title: string,
  links: { url: string, name: string }[]
}

const LinkList = ({title, links}:LinkListProps) => (
  <div className={styles.links}>
    <h2>{title}</h2>
      <ul>
        {links.map((link) => (
          <li>
            <a href={link.url}>{link.name}</a>
          </li>
        ))}
      </ul>
  </div>
)

export default class Allaccenturelinks extends React.Component<
  IAllaccenturelinksProps,
  {}
> {
  public render(): React.ReactElement<IAllaccenturelinksProps> {
    const {
      quickLinks,
      navLinks,
    } = this.props;


    const listQLinks = quickLinks;

    const listNavLinks = navLinks;

    const formattedQlinks = listQLinks.map(qLink => ({name: qLink.Title, url: qLink.Url}))
    
    return (
      <section>
        <div className={styles.allaccenturelinks}>
          <LinkList title="Quick Links" links={formattedQlinks}/>
          {listNavLinks.map((item) => {
            const formattedTopLinks = item.TopLinks.map(tLink => ({name: tLink.Title, url: tLink.Url}))
            return (
              <LinkList title={item.Title} links= {formattedTopLinks}/>
            )
          })}
        </div>
      </section>
    );
  }
}

