export interface INavLinkSite {
    Id: number;
    Title: string;
    Url: string;
    Description: string;
    IsTopLink: boolean;
    TopLinkTitle: string;
    IsAtoZ: boolean;
    AtoZTitle: string;
    TabDisplay: boolean;
    TabTitle: string;
    SortOrder: number;
}

export interface INavLinkCategory {
    Id: number;
    Title: string;
    Description: string
    SortOrder: number;
    SubCategories: Array<INavLinkSubCategory>;
}

export interface INavLinkSubCategory {
    Id: number;
    Title: string;
    Description: string
    SortOrder: number;
    Groups: Array<INavLinkGroup>;
}

export interface INavLinkGroup {
    Id: number;
    Title: string;
    Description: string
    SortOrder: number;
    Sites: Array<INavLinkSite>;
}

export interface INavLinkTop {
    Title: string;
    TopLinks: Array<INavLinkSite>;
}


