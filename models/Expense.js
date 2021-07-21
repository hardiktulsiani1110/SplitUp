import moment from "moment";
class Expense{
    constructor(id,groupId,title,amount,paidBy,paidTo,date){
        this.id = id;
        this.groupId = groupId;
        this.title=title;
        this.amount=amount;
        this.paidBy = paidBy;//array
        this.paidTo = paidTo;//array
        this.date = date;
    }
    get readableDate() {
        return moment(this.date).format('LL');
    }
}
export default Expense;

// MMMM Do YYYY, hh:mm