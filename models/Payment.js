class Payment{
    constructor(id,groupId,amount,payerId,payerName,burrowerId,burrowerName,expenseTitle,isSettled){
        this.id = id;
        this.groupId = groupId;
        this.amount=amount;
        this.payerId = payerId;
        this.payerName = payerName;
        this.burrowerId = burrowerId;
        this.burrowerName = burrowerName;
        this.expenseTitle = expenseTitle;
        this.isSettled = isSettled;//boolean
    }
}
export default Payment;