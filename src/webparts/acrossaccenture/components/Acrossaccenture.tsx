import * as React from 'react';
import styles from './Acrossaccenture.module.scss';
import { IAcrossaccentureProps } from './IAcrossaccentureProps';
import { IArticleProps } from '../../Common/IArticle';
import ArticlesService from '../../Services/ArticlesService';


// const [seeMore, setSeeMore] = React.useState(false);
export default class Acrossaccenture extends React.Component<IAcrossaccentureProps, {allArticles: IArticleProps[], firstArticle: IArticleProps, acrossArticles: IArticleProps[], backgroundImage: string, seeMore: boolean}> {

 constructor(props:IAcrossaccentureProps){
    super(props);
    this.state = { 
      allArticles: [],
      firstArticle: null,
      acrossArticles: [],
      backgroundImage: "",
      seeMore: false
    };
  }

  public setSeeMore(state: boolean): void{
    this.setState({
      seeMore: state
    })
  }

  public async componentDidMount(): Promise<void> {
    
    const articlesFiltered = await this.getArticles();
    const firstArticle = articlesFiltered[0];
    const acrossArticles = articlesFiltered.slice(1, 3);

    this.setState({
      allArticles: articlesFiltered,
      firstArticle: firstArticle,
      acrossArticles: acrossArticles,
      backgroundImage: firstArticle.post_thumb
    })
  }
  
  public async getArticles(): Promise<IArticleProps[]>{
    const articlesObtained = await ArticlesService.get();
    const articlesFiltered = articlesObtained.articles.filter((article: { aggmeta_short_tag: string; }) => article.aggmeta_short_tag === "Global");
    return articlesFiltered;
  }
  
  public render(): React.ReactElement<IAcrossaccentureProps> {
    return (
      <section>
        <div className={styles.articlesContainer}>
          
          <div className={styles.articleFeatured}>
            {
              this.state.firstArticle !== null ?(
                <>
                  <a href={this.state.firstArticle.post_link} target="_blank" rel="noreferrer">

                    <div className={styles.acrossAccentureImgSection}>
                      <img src={this.state.firstArticle.post_thumb} alt="Article image" />
                    </div>

                    <div>
                      <div className={styles.acrossAccentureGrid0}>
                        <h1 className={styles.acrossArticleTitle}>
                          {this.state.firstArticle.source_short_tag}
                        </h1>

                        <h2 className={styles.acrossArticleHeader}>
                          {this.state.firstArticle.post_title}
                        </h2> 

                        <p className={styles.acrossArticleDescription}>
                          {this.state.firstArticle.post_content_stripped}
                        </p>
                      </div>
                    </div>
                    
                  </a>
                </>
              ) : ('')
            }
            
          </div>

          <div className={styles.acrossArticles}>
            <ul>
              {
                this.state.acrossArticles.map((article:IArticleProps) => 
                    <li key={article.article_id} className={styles.acrossArticleItemContainer}>
                      <a href={article.post_link} target="_blank" rel="noreferrer">
                        <h1 className={styles.acrossArticleTitle}>
                          {article.source_short_tag}
                        </h1>
                        <h2 className={styles.acrossArticlesItem}>
                          {article.post_title}
                        </h2>

                      </a>
                    </li>
                  )
              }
            </ul>
          </div>

        </div>

        {
          this.state.firstArticle !== null ?(
            <div className={styles.acrossAccentureSeeMore} onClick={() => this.setSeeMore(!this.state.seeMore)}>
              {this.state.seeMore ? "- See less" : "+ See more"}
            </div>
          ) : ('')
        }

        { this.state.seeMore ? (
          <>
            <h1 className={styles.seeMoreHeader}>Across Accenture</h1>
            <ul>
            {
            this.state.allArticles.map((article:IArticleProps) => 
              <li key={article.article_id} className={styles.articlesSeeMore}>
                <a href={article.post_link} target="_blank" rel="noreferrer">
                  <h2 className={styles.seeMoreArticleTitle}>
                    {article.source_short_tag} - X Days Ago
                  </h2>
                  <h3 className={styles.seeMoreArticleItem}>
                    {article.post_title}
                  </h3>
                  <p className={styles.seeMoreArticleDescription}>
                    {article.post_content_stripped}
                  </p>
                </a>
              </li>
            )
            }
            </ul>
          </>
        ) : ('')
        }
        

      </section>
    );
  }
}

