export class People{

    private supervisornm?:string;
    private manager?:string;
    private talentfulfillmentspecialist?: string;
    private hrrepresentativename?: string;
    private trainingcoordinatornm?: string;

    constructor(supervisornm, manager, talentfulfillmentspecialist, hrrepresentativename, trainingcoordinatornm, init?: Partial<People>) {
        this.supervisornm = supervisornm;
        this.manager = manager;
        this.talentfulfillmentspecialist = talentfulfillmentspecialist;
        this.hrrepresentativename = hrrepresentativename;
        this.trainingcoordinatornm = trainingcoordinatornm;
    }
}
