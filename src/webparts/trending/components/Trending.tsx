import * as React from 'react';
import styles from './Trending.module.scss';
import { ITrendingProps } from './ITrendingProps';
/* import { escape } from '@microsoft/sp-lodash-subset'; */
import ArticlesService from '../../Services/ArticlesService'
import { IArticleProps } from '../../Common/IArticle';



export default class Trending extends React.Component<ITrendingProps, { articles: IArticleProps[] }> {


  constructor(props: ITrendingProps) {

    super(props);

    this.state = { articles: [] };
  }




  public async componentDidMount(): Promise<void> {

    const articlesFiltered = await this.getArticles();


    this.setState({
      articles: articlesFiltered
    });
  }


  public async getArticles(): Promise<[]> {

    const articles = await ArticlesService.get();
    const articlesFiltered = articles.articles.filter((article: { aggmeta_short_tag: string; }) => article.aggmeta_short_tag === "Trending");
    return articlesFiltered;
  }


  public render(): React.ReactElement<ITrendingProps> {

    return (
      <>
        <div>
          <h3 className={styles.trendingHeader} > Trending News</h3>
        </div>
        <div className={styles.trendingGridContainer}>
          {
            this.state.articles.map((article: IArticleProps) => {
              return (
                <>
                  <div key={article.article_id} className={styles.trendingArticleTemplate} >

                    <div className={styles.trendingArticleTitle}>

                      <a href={article.site_url} target="_blank" rel="noreferrer" className={styles.trendingArticleTitle}>{article.short_tag} </a>
                      <div tabIndex={1} className={styles.trendingMarkAsReadIcon} />
                    </div>
                    <a href={article.post_link} target="_blank" rel="noreferrer" className={styles.trendingHeadingText}>
                      {article.post_title}
                    </a>
                  </div>

                </>




              )
            }
            )
          }
        </div >
      </>

    )

  }
}


