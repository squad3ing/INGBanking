import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';

class EditableNameTag extends PolymerElement {
  static get properties() {
    return {
      owner: {
        type: String,
        value: 'Daniel'
      },
      baseUrl:
      {
        type: String,
        //value: "http://10.117.189.210:9090/app"
        value: "http://10.117.189.210:8090/app"
      },
      showLloggedInUserDetails: {//showLloggedInUserDetails,showTransferPage,showAccountDetailsPage
        type: Boolean,
        value: true
      },
      showTransferPage: {
        type: Boolean,
        value: false
      },
      showAccountDetailsPage: {
        type: Boolean,
        value: false
      },
      loggedInUsrAccountDetails: {
        type: Object,
        value: {}

      },
      loggedInUsraccountDetailNTrans: {
        type: Array,
        value: []

      },
      loggedInUsraccountOnce: {
        type: Object,
        value: {}

      },
      toAccountListArray: {
        type: Array,
        value: []
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    localStorage.apiname = "transfer";
    this.getAccount();

  }
  getToAccountList() {

    console.log("getToAccountList")
    // localStorage.apiname=="transfer";
    localStorage.apiname = "toAccountList";
    let ajaxRef = this.$.ajax;
    ajaxRef.method = "get";
    ajaxRef.url = `${this.baseUrl}/beneficiary/${localStorage.accountId}`,
      ajaxRef.contentType = "application/json"
    ajaxRef.generateRequest();
  }
  getAccount() {
    let ajaxRef = this.$.ajax;
    ajaxRef.method = "get";
    ajaxRef.url = `${this.baseUrl}/account/${localStorage.accountId}`,
      ajaxRef.contentType = "application/json"
    ajaxRef.generateRequest();
  }
  _onError(event) {
    const req = event.detail; // iron-request
    var result = req.response;
    console.log("Result:" + JSON.stringify(result));
    console.log('status code', req.status);
    console.log('status text', req.statusText);
    // I think one of those two would be what you're looking for.
    //console.log(event.detail.response);
    // alert(result.message);
    alert("Something Went Wrong! ");


  }
  _onResponse(event, request) {
    console.log(localStorage.apiname)
    const result = event.detail.response;
    if (localStorage.apiname == "transfer") {
      this.loggedInUsrAccountDetails = result;
      if (this.loggedInUsraccountDetailNTrans) {
        alert("Successfully Tranaction Done");
      }

    } else if (localStorage.apiname == "accountDetail") {
      //localStorage.apiname=="accountDetail"
      this.loggedInUsraccountDetailNTrans = result;
      console.log("data:" + result);
      this.loggedInUsraccountOnce = result[0].fromAccount;
      
    } else if (localStorage.apiname == "toAccountList") {
      //localStorage.apiname=="accountDetail"
      this.toAccountListArray = result;
    }else if (localStorage.apiname == "transferDetails") {
      //localStorage.apiname=="accountDetail"
      //this.toAccountListArray = result;
      alert("Successfully Transferd");
    } else if (localStorage.apiname == "transferDeta") {
      alert("Transaction Id: " + result.transactionId + "\n Transcation Amount: " + result.transferAmount + "\n From Account: " + result.fromAccount.accountHolderName + "\n To Account : " + result.toAccount.accountHolderName + "\n Transfer Type: " + result.transferType);
      console.log(result)
    }

  }
  _transMoney() {
    // alert("_transMoney");
    console.log("_transMoney")
    this.getToAccountList();
    this.showLloggedInUserDetails = false;
    this.showTransferPage = true;
    console.log('_transMoney');



    //  this.loggedInUsraccountDetail = result;

  }

  _handleChangeSelect(event) {
    console.log(event.target.selectedItem)
    this.fromAccountNumber = event.target.selectedItem.value;
  }
  _accountDetails() {
    //showLloggedInUserDetails,showTransferPage,showAccountDetailsPage
    localStorage.apiname = "accountDetail"
    this.showLloggedInUserDetails = false;
    this.showTransferPage = false;
    this.showAccountDetailsPage = true;

    //call 
    let ajaxRef = this.$.ajax;
    ajaxRef.method = "get";
    ajaxRef.url = `${this.baseUrl}/accountDetail/${localStorage.accountId}`,
      // ajaxRef.body = jsonBody;
      ajaxRef.contentType = "application/json"
    ajaxRef.generateRequest();


  }
  _currentTranactionDetails(event) {
   // console.log(_currentTranactionDetails)
    localStorage.apiname = "transferDeta";
    console.log(JSON.parse(event.target.dataset.item).transactionId);
    let id= JSON.parse(event.target.dataset.item).transactionId;
    let ajaxRef = this.$.ajax;
    ajaxRef.method = "get";
    ajaxRef.url = `${this.baseUrl}/transferDetails/${id}`;
    ajaxRef.generateRequest();
    console.log(localStorage.apiname)
    // alert(event.target.id);
  }
  _makePayment() {
    localStorage.apiname = "transfer";
    console.log(this.fromAccountNumber, localStorage.accountId)
    // {fromAccount,toAccount,comment,transferAmount}
    const jsonBody = {
      fromAccount: localStorage.accountId,
      toAccount: this.fromAccountNumber,
      comment: this.comment,
      transferAmount: this.transferAmount
    }
    let ajaxRef = this.$.ajax;
    ajaxRef.method = "put";
    ajaxRef.url = `${this.baseUrl}/transfer`,
      ajaxRef.body = jsonBody;
    ajaxRef.contentType = "application/json"
    ajaxRef.generateRequest();

    // alert("_makePayment");
  }
  _getAccountDetails() {
    console.log(localStorage.accountId)
    return localStorage.accountId;
  }
  static get template() {
    return html`
    <custom-style>
  <style>
    paper-button.custom {
      --paper-button-ink-color: var(--paper-pink-a200);
      /* These could also be individually defined for each of the
        specific css classes, but we'll just do it once as an example */
      --paper-button-flat-keyboard-focus: {
        background-color: var(--paper-pink-a200) !important;
        color: white !important;
      };
      --paper-button-raised-keyboard-focus: {
        background-color: var(--paper-pink-a200) !important;
        color: white !important;
      };
    }
    paper-button.custom:hover {
      background-color: var(--paper-indigo-100);
    }
    paper-button.pink {
      color: var(--paper-pink-a200);

    }
    paper-button.indigo {
      background-color: var(--paper-indigo-500);
      color: white;
      --paper-button-raised-keyboard-focus: {
        background-color: var(--paper-pink-a200) !important;
        color: white !important;
      };
    }
    paper-button.green {
      background-color: var(--paper-green-500);
      color: white;
    }
    paper-button.green[active] {
      background-color: var(--paper-red-500);
    }
    paper-button.disabled {
      color: white;
      background-color: bisque;
    }
    .cardStyle{
      background-color:azure;
      color:#ff6600;
      width:100%
    }
    
  </style>
</custom-style>

<template is="dom-if" if="{{showLloggedInUserDetails}}">
    <paper-card heading="Overview  ING Product Group" image="" alt="Emmental" class="cardStyle">
    <div class="card-content">
           
    </div>
            <div class="card-actions "  style="padding:5%;border:5px solid beige; background-color:bisque">
            <h4>My Saving Account:</h4>
            <div>Balance | :<small>[[loggedInUsrAccountDetails.balance]]</small></div>
            <div>Account Number | :<small>[[loggedInUsrAccountDetails.accountId]]</small></div>
            <paper-button raised class="custom indigo" on-click="_accountDetails">Account Details</paper-button>
            <paper-button toggles raised class="custom green"  on-click="_transMoney">Transfer</paper-button>
            </div>
  </paper-card>
  </template>
  
  
  <template is="dom-if" if="{{showTransferPage}}">
  <paper-card heading="Money Transfer" image="" alt="Emmental" class="cardStyle">
  <div class="card-actions"  >
  <p class="headerStyle">
 
  <div class="horizontal justified">
            <iron-form id="loginForm">
              <form >
         
                  <paper-input name="toAccount" label="From Account" value="{{_getAccountDetails()}}" required auto-validate disabled error-message="Please Account No "></paper-input>
                <!--  <paper-input name="toAccount"  label="To Account" value="{{toAccount}}" required auto-validate error-message="Please Destination Account No "></paper-input>-->
                  <paper-dropdown-menu label="Select Benificiary" on-iron-select="_handleChangeSelect">
                  <paper-listbox slot="dropdown-content" >
                  <template is="dom-repeat" items={{toAccountListArray}} >
                  <paper-item value={{item.accountId}}>{{item.accountHolderName}}</paper-item>
                  </template>
                  
                
                  </paper-listbox>
           </paper-dropdown-menu>

           
                  <paper-input type="text" name="transferAmount"  label="Amount To Transfer" value="{{transferAmount}}"  required auto-validate error-message="Please Enter TransferAmoun "></paper-input>
                  <iron-autogrow-textarea rows="4" lable="Comment"  value="comment" placeholder="Please Comments.."></iron-autogrow-textarea>
                <h4>Date| <small>Today</small></h4>
                  <paper-button raised >
                  <paper-button raised class="custom indigo"  on-click="_makePayment">Confirm</paper-spinner></paper-button>
                  <paper-button toggles raised class="custom green" on-click="_resetForm">Reset</paper-button>
          </form>
            </iron-form>
    </div>
  </paper-card>
  </template>
  

<!--Account Details Page-->
<template is="dom-if" if="{{showAccountDetailsPage}}">
<paper-card heading="Product Details and List of Statements" image="" alt="Emmental" class="cardStyle">
<div class="card-actions"  >
<p class="headerStyle">
Login Ing Web
<div class="horizontal justified">

<div><b>All Transactions|</b></div><br />

<div>Account Number | <span>{{loggedInUsraccountOnce.accountId}}</span></div>
<div>Balance | <span>{{loggedInUsraccountOnce.balance}}</span></div>
<div>Creation Date | <span>{{loggedInUsraccountOnce.createdBy}}</span></div>
     
<template is="dom-repeat" id="employeeList"   items="{{loggedInUsraccountDetailNTrans}}" style="padding:2%">
<div style="margin:20px;color:black">
        <div>Transaction Id | <span><div on-click="_currentTranactionDetails" style="text-decoration: underline; color:blue"><a data-item$="{{item}}" id="{{loggedInUsraccountDetailNTrans.transactionId}}"  >{{item.transactionId}}</a></div></span></div>
        <div>TransferAmount | <span>{{item.transferAmount}}</span></div>
        <div>Comment  | <span>{{item.comment}}</span></div>

</div>


   
</template>

       
  </div>
</paper-card>
</template>

 

        <!--Iron Ajax Start-->
        <iron-ajax
                id="ajax"
                on-response="_onResponse"
                on-error ="_onError"
                debounce-duration="300">
        </iron-ajax> 
        <!--Iron Ajax End-->
    `;
  }
}

customElements.define('editable-name-tag', EditableNameTag);