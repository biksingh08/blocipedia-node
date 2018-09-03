module.exports = class ApplicationPolicy {

    constructor(user, record) {
        this.user = user;
        this.record = record;
     }

     _isOwner() {
       return this.record && (this.record.userId == this.user.id);
     }
     _isStandard() {
       return this.user && this.user.role == 0;
     }
     _isPremium() {
       return this.user && this.user.role == 1;
    }
     _isAdmin() {
       return this.user && this.user.role == 2;
     }
     new() {
       return this.user != null;
     }
     edit() {
       return this.new() && this.record;
     }
     create() {
       return this.new();
     }
      update() {
        return this.edit();
      }
      destroy() {
        return this.update() && (this._isOwner() || this._isAdmin());
      }
     show() {
       return true;
     }

   }
