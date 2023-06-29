import React from "react";
import LocalForage from "localforage";

import Alert from "react-bootstrap/Alert";

import Image from "react-bootstrap/Image";

import DashBkgd from "./Images/dash_digital-cash_logo_2018_rgb_for_screens.png";

import TopNav from "./Components/TopNav/TopNav";
import BottomNav from "./Components/BottomNav/BottomNav";
import LoginBottomNav from "./Components/BottomLoginNav/LoginBottomNav";

import LandingPage from "./Components/Pages/LandingPage";
import InvitesPage from "./Components/Pages/InvitesPage";
import GroupPage from "./Components/Pages/GroupPage";

import Footer from "./Components/Footer";

import LoginSignupModal from "./Components/TopNav/LoginSignupModal";
import LogoutModal from "./Components/TopNav/LogoutModal";

import CreateGroupModal from "./Components/BottomNav/BottomNavModalFolder/CreateGroupModal";
import JoinGroupModal from "./Components/Pages/JoinGroupModal";
import ActiveGroupsModal from "./Components/BottomNav/BottomNavModalFolder/ActiveGroupsModal";

import DeleteGroupModal from "./Components/GroupBottomNav/GroupBottomNavModals/DeleteGroupModal";

import "./App.css";

const Dash = require("dash");

const {
  Essentials: { Buffer },
  PlatformProtocol: { Identifier },
} = Dash;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,

      isLoading: false,
      isLoadingRefresh: false,
      //isLoadingRecentTab: false,
      isLoadingOthersInvites: true,
      isLoadingGroup: false,
      errorToDisplay: false,

      mode: "dark",
      presentModal: "",
      isModalShowing: false,
      whichNetwork: "testnet",

      mnemonic: "",
      identity: "",
      identityInfo: "",
      identityRaw: "",
      uniqueName: "",
      walletId: "",

      dgtRawInvites: [], //Gets selfinvites && ToYouinvites/ used in deletegroups
      stagedAcceptedInvites: [],
      stagedRemovedInvitesNames: [],
      stagedGroupMsgs: [],

      dgtAcceptedInvites: [], // Just selfinvites //used to getgroupnames and prevent second invite to self and used on InvitesPage to display

      //dgtFromYouInvites: [], //Not Currently doing anything, need to implement
      //tuplesRecentToDisplay: [], //This if for the RecentTab to Display

      othersInvitesToDisplay: [],

      platformLogin: false,
      LocalForageKeys: [],

      skipSynchronizationBeforeHeight: 853000,
      mostRecentBlockHeight: 853000,

      expandedTopNav: false,

      DataContractDGT: '6muxUBxoGzysM5TaUcoGYNNLnqEW1U4ecZ37ugZEG3D7',
      DataContractDPNS: 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec',

      selectedGroup: "",
      isGroupShowing: false,
    };
  }

  closeExpandedNavs = () => {
    this.setState({
      expandedTopNav: false,
    });
  };

  toggleExpandedNav = (selectedNav) => {
    if (this.state.expandedTopNav) {
      this.setState({
        expandedTopNav: false,
      });
    } else {
      this.setState({
        expandedTopNav: true,
      });
    }
  };

  hideModal = () => {
    this.setState({
      isModalShowing: false,
    });
  };

  showModal = (modalName) => {
    this.setState({
      presentModal: modalName,
      isModalShowing: true,
    });
  };

  handleSelectedJoinGroup = (groupName) => {
    this.setState({
      selectedGroup: groupName,
    }
    ,() =>this.showModal('JoinGroupModal')
    );
  }

  hideGroupPage = () => {
    this.setState({
      isGroupShowing: false,
    });
  };

  showGroupPage = (groupName) => {
    this.setState({
      isLoadingGroup: true, //IS THIS DOING ANYTHING?? ->
      selectedGroup: groupName,
      isGroupShowing: true,
    });
  };

  handleMode = () => {
    if (this.state.mode === "primary")
      this.setState({
        mode: "dark",
      });
    else {
      this.setState({
        mode: "primary",
      });
    }
  };

  handleStagedMsgs =(msg)=>{
    this.setState({
      stagedGroupMsgs: [msg, ...this.state.stagedGroupMsgs]
    });
  }

  handleRemoveStagedMsgs =()=>{ // assume msgs will delete in order of FIFO
    this.setState({
      stagedGroupMsgs: this.state.stagedGroupMsgs.slice(0,-1),
    });
  }


  handleLogout = () => {
    this.setState({
      isLoggedIn: false,
      mnemonic: "",
      identity: "",
      identityInfo: "",
      identityRaw: "",
      uniqueName: "",
      walletId: "loggedout",

      dgtRawInvites: [],
      dgtAcceptedInvites: [],
      dgtFromYouInvites: [],
      tuplesRecentToDisplay: [],
      othersInvitesToDisplay: [],

      isGroupShowing: false,
    });
  };

  // handleAddGroupMsgsAndDataToLF = () => {//ADD STUFF HERE..  VERSION 2
  // };

  //PLATFORM LOGIN SETUP
  componentDidMount() {
    LocalForage.config({
      name: "dashmoney-platform-login",
    });

    LocalForage.getItem("mostRecentWalletId")
      .then((val) => {
        if (val !== null) {
          this.handleStartQuerySeq(val.identity);
          this.setState(
            {
              walletId: val.walletId,
              identity: val.identity,
              uniqueName: val.name,
              //Version2 may have the group data
            }
          );
        } else {
          console.log("There is no mostRecentWalletId");
        }
      })
      .catch(function (err) {
        console.log(err);
      });

    //***Next Bit Gets MostRecentBlockHeight */
    const clientOpts = {
      network: this.state.whichNetwork,
    };
    const client = new Dash.Client(clientOpts);

    const getMostRecentBlockHeight = async () => {
      const status = await client.getDAPIClient().core.getStatus();

      return status;
    };

    getMostRecentBlockHeight()
      .then((d) => {
        let blockHeight = d.chain.blocksCount;
        console.log("Most Recent Block Height:\n", blockHeight);
        this.setState({
          mostRecentBlockHeight: blockHeight - 7,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());

      LocalForage.keys()
      .then((keys) => {
        this.setState({
          LocalForageKeys: keys,
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  handleLoginwithMnem = (theMnemonic) => {

    if (this.state.LocalForageKeys.length === 0) {
      this.setState({
        isLoggedIn: true,
        isLoading: true, 
        mnemonic: theMnemonic,
      },()=>this.getIdentitywithMnem(theMnemonic));
    } else {
      this.setState({
        isLoggedIn: true,
        mnemonic: theMnemonic,
      },()=>this.checkPlatformOnlyLogin(theMnemonic));
    }
  };

  checkPlatformOnlyLogin = (theMnemonic) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: theMnemonic,
        offlineMode: true,
      },
    };
    const client = new Dash.Client(clientOpts);

    let walletIdToTry;

    const createWallet = async () => {
      const account = await client.getWalletAccount();

      walletIdToTry = account.walletId;
     // console.log("walletIdToTry:", walletIdToTry);

      return walletIdToTry === this.state.walletId;
    };

    createWallet()
      .then((mostRecentMatch) => {
        console.log(`Most Recent Matches -> ${mostRecentMatch}`);

        if (!mostRecentMatch) {
          let isKeyAvail = this.state.LocalForageKeys.includes(walletIdToTry);
          // console.log(`LocalForage Test -> ${isKeyAvail}`);
   
           if (isKeyAvail) {
             console.log("This here is a login skip!!");
   
             LocalForage.getItem(walletIdToTry)
               .then((val) => {
                 //CHANGE IMPACT LF IDENTITY STRING TO-> OBJECT WITH IDENTITY AND NAME
   
               //  console.log("Value Retrieved", val);
   
                 if (val !== null ||
                   typeof val.identity !== "string" ||
                   val.identity === "" ||
                   val.name === "" ||
                   typeof val.name !== "string"
                 ) {
                   
                   this.setState({
                     platformLogin: true,
                     identity: val.identity,
                     uniqueName: val.name,
                     walletId: walletIdToTry,
                     isLoading: true,
                     isLoadingRefresh:true,
                     isLoadingOthersInvites:true,

                     dgtRawInvites: [],
            dgtAcceptedInvites: [],
            dgtFromYouInvites: [],
            othersInvitesToDisplay: [],
                     //maintain Loading bc continuing to other functions
                   },()=>this.handleStartQuerySeq(val.identity));
                     //******************** */
           //CREATE AN OBJECT AND PUT IT IN THERE!!!
           let lfObject = {
             walletId: walletIdToTry,
             identity: val.identity,
             name: val.name,
           };
           //This is where I save to localForage if walletId is not there.
           LocalForage.setItem("mostRecentWalletId", lfObject)
             .then((d) => {
               //return LocalForage.getItem(walletId);
              // console.log("Return from LF setitem:", d);
             })
             .catch((err) => {
               console.error(
                 "Something went wrong setting to localForage:\n",
                 err
               );
             });
           //******************** */
                 } else {
                 //  console.log("platform login failed");
                   //this.getIdentitywithMnem(theMnemonic);
                   //() => this.getNamefromIdentity(val)); // send to get it
                 }
               })
               .catch((err) => {
                 console.error(
                   "Something went wrong getting from localForage:\n",
                   err
                 );
               });
           } else {
             this.setState({
               //This is for if no platform login at all. resets
               identityInfo: "",
               identityRaw: '',
               uniqueName: "",
               dgtRawInvites: [],
            dgtAcceptedInvites: [],
            dgtFromYouInvites: [],
            othersInvitesToDisplay: [],
                
             },()=>this.getIdentitywithMnem(theMnemonic));
             
           }
         }//Closes mostRecentMatch
         else{
             this.setState({
               platformLogin: true,
               isLoading: false,
             });
         } 
         })
         .catch((e) => console.error("Something went wrong:\n", e))
         .finally(() => client.disconnect());
          
        
  };

  handleStartQuerySeq = (theIdentity) => {
    this.getDGTInviteDocs(theIdentity);
    this.getIdentityInfo(theIdentity);
  }
  /********************************************/
  //BELOW IS THE INITIAL TRIGGERED SEQUENCE

  // 1. this.getDGTInviteDocs(); -> DONE
  // 2. this.sortOutInvites() -> DONE
  // 2.5 Get names for others invites -> DONE
  // 3. this.getIdentityInfo() -> and got idRaw -> Done 

  /********************************************/

  getIdentitywithMnem = (theMnemonic) => {
    console.log("Called getIdwithMnem");
    const client = new Dash.Client({
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: theMnemonic,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: this.state.mostRecentBlockHeight,
        },
      },
    });

    let walletIdToTry;

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();

      walletIdToTry = account.walletId;
      //console.log(walletIdToTry);

      return account.identities.getIdentityIds();
    };

    retrieveIdentityIds()
      .then((d) => {
        console.log("Mnemonic identities:\n", d);
        //This if - handles if there is an identity or not
        if (d.length === 0) {
          this.setState({
            isLoading: false,
            identity: "No Identity",
          });
        } else {
          this.setState(
            {
              walletId: walletIdToTry,
              identity: d[0],
              isLoading: false,
              //maintain Loading bc continuing to other functions
            },
            () => this.callEverythingBcHaveIdentityNow(d[0])
          );
        }
      })
      .catch((e) => {
        console.error("Something went wrong getting IdentityIds:\n", e);
        this.setState({
          isLoading: false,
          identity: "No Identity",
        });
      })
      .finally(() => client.disconnect());
  };

  callEverythingBcHaveIdentityNow = (theIdentity) => {
    if(!this.state.platformLogin){
    this.getDGTInviteDocs(theIdentity);
    this.getNamefromIdentity(theIdentity);
    this.getIdentityInfo(theIdentity);
    }
  };

  getNamefromIdentity = (theIdentity) => {
    console.log("Get NamesfromIdentity");
    const client = new Dash.Client({
      network: this.state.whichNetwork,
    });

    const retrieveNameByRecord = async () => {
      // Retrieve by a name's identity ID
      return client.platform.names.resolveByRecord(
        "dashUniqueIdentityId",
        theIdentity // Your identity ID
      );
    };

    retrieveNameByRecord()
      .then((d) => {
        let nameRetrieved = d[0].toJSON();
        //console.log("Name retrieved:\n", nameRetrieved);

        //******************** */
        //CREATE AN OBJECT AND PUT IT IN THERE!!!
        let lfObject = {
          identity: theIdentity,
          name: nameRetrieved.label,
        };
        //This is where I save to localForage if walletId is not there.
        LocalForage.setItem(this.state.walletId, lfObject)
          .then((d) => {
            //return LocalForage.getItem(walletId);
            //console.log("Return from LF setitem:", d);
          })
          .catch((err) => {
            console.error(
              "Something went wrong setting to localForage:\n",
              err
            );
          });

        //******************** */
        lfObject = {
          identity: theIdentity,
          name: nameRetrieved.label,
          walletId: this.state.walletId,
        };

        LocalForage.setItem("mostRecentWalletId", lfObject)
          .then((d) => {
            //return LocalForage.getItem(walletId);
           // console.log("Return from LF setitem:", d);
          })
          .catch((err) => {
            console.error(
              "Something went wrong setting mostRecent to localForage:\n",
              err
            );
          });
        //******************** */
        this.setState(
          {
            uniqueName: nameRetrieved.label,
            isLoading: false,
          }
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        //console.log("There is no dashUniqueIdentityId to retrieve");
        this.setState({
          isLoading: false,
          uniqueName: "Er", //Er for the Error -> I guess
        });
      })
      .finally(() => client.disconnect());
  };

  /******************************************* */
//REFRESH TRIGGER
  handleGetInvitesAndGetIdInfo = () => {
    console.log("Handle Get Invites and Id Info");
    this.getIdentityInfo(this.state.identity);

    if (!this.state.isLoadingRefresh) {
      console.log("Refresh DGT Invite Docs");
      this.setState(
        {
          isLoadingRefresh: true,
        },
        () => this.getDGTInviteDocs(this.state.identity)
      );
    } else {
      this.getDGTInviteDocs(this.state.identity);
    }
  };


  getDGTInviteDocs = (theIdentity) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGTContract: {
          contractId: this.state.DataContractDGT, // Your contract ID
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    //DGTInvite Query
    const getDocuments = async () => {
      return client.platform.documents.get("DGTContract.dgtinvite", {
        where: [
          ["toId", "==", Buffer.from(Identifier.from(theIdentity))],
        ],
      });
    };

    getDocuments()

      .then((d) => {
        let rawArray = [];
        let docArray = [];
        for (const n of d) {
          //console.log("Invite Documents:\n", n.toJSON());
          rawArray = [...rawArray, n]; // <- REFACTOR THIS
          docArray = [...docArray, n.toJSON()];
        }
        //this.sortOutInvites(docArray);

        this.setState(
          {
            dgtRawInvites: rawArray,
          },
          () => this.sortOutInvites(docArray)
        );
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      //need to setState to handle Error and set isLoadingEveryone to false
      .finally(() => client.disconnect());
  };

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  sortOutInvites = (inviteArray) => {
    //Invites sorted but if $ownerId === toId create a separate array for and set both to state
    //Go through array one at a time and push to two new separate arrays
    let acceptedInvites = [];
    let othersInvites = [];

    inviteArray.forEach((invite) => {
      if (invite.dgt === 'self') {
        acceptedInvites.push(invite);
      } else {
        if (invite.toId !== invite.$ownerId) {
        othersInvites.push(invite);
        }
      }
    });
//BELOW adds the accepted groups, if added group
    if(this.state.stagedAcceptedInvites.length !== 0){
      acceptedInvites = [...this.state.stagedAcceptedInvites, 
        ...acceptedInvites]
    }

    let groupNamesOfAccepted = acceptedInvites.map((invite) => {
      return invite.group;
    });

//BELOW removes deleted groups , if Deleted Groups
    if(this.state.stagedRemovedInvitesNames.length !== 0){

      let mutableArray = acceptedInvites;

      this.state.stagedRemovedInvitesNames.forEach(name => {

      if (groupNamesOfAccepted.includes(name)) {

        let groupIndex = groupNamesOfAccepted.indexOf(name);
       // console.log('groupIndex', groupIndex);
  
        mutableArray.splice(groupIndex,1);
  
      }
    
  });

  acceptedInvites = mutableArray;
}

//Below Remove from othersInvites, if Added Group
    let othersInvitesUnique = [];

    othersInvites.forEach(invite => {
      if(!groupNamesOfAccepted.includes(invite.group)){
        othersInvitesUnique.push(invite)
      }
    })


    this.setState(
      {
        dgtAcceptedInvites: acceptedInvites,
        //isLoadingRecentTab: true, //Only bc free setState and will be calling -> Not implementing RecentTab -> 
      },()=>this.getNamesforDGTinvites(othersInvitesUnique)
      );
  };
//REMOVED THIS FUNCTIONALITY FOR NOW ****** DONT DELETE ******
  // helperToGetRecentTabMsgs = (othersInvites) => {
  //   this.getNamesforDGTinvites(othersInvites); //BC need names

  //   // this.getDGTRecentTabDocs(); //DOESN'T EXIST YET!!! ->
  // };

  //REMOVED THIS FUNCTIONALITY FOR NOW ****** DONT DELETE ******
    // //LINKED FUNCTIONS -  START
  // getDGTRecentTabDocs = () => {
  //   console.log(`Calling Recent Tab Msgs`);

  //   const clientOpts = {
  //     network: this.props.whichNetwork,
  //     apps: {
  //       DGTContract: {
  //         contractId: this.state.DataContractDGT, // Your contract ID
  //       },
  //     },
  //   };
  //   const client = new Dash.Client(clientOpts);

  //   //################################################################
  //   // I have to rewrite DC and include a query for this... but i think the query is what I want..
  //   //DGTMessages Query ->
  //   const getMessages = async () => {
  //     return client.platform.documents.get("DGTContract.dgtmsg", {
  //       limit: 60,
  //       where: [
  //         ["timeStamp", ">=", 2546075019551 - Date.now()],
  //         ["group", "in", this.props.acceptedInvites], //IDK if accepted invites is an array of groupNames so need to check that. -> yeah I dont think It is in the right format -> fix ->
  //       ],
  //       orderBy: [
  //         //is this allowed?? need to check the rules
  //         ["timeStamp", "asc"],
  //       ],
  //     });
  //   };

  //   getMessages()
  //     .then((d) => {
  //       if (d.length === 0) {
  //         this.setState({
  //           tuplesRecentToDisplay: "No Messages",
  //           isLoadingRecentTab: false,
  //         });
  //       } else {
  //         let docArray = [];
  //         for (const n of d) {
  //           console.log("Document:\n", n.toJSON());
  //           docArray = [...docArray, n.toJSON()];
  //         }

  //         this.getNamesRecentTabMsgs(docArray);
  //       }
  //     })
  //     .catch((e) => console.error("Something went wrong:\n", e))
  //     //need to setState to handle Error and set isLoadingEveryone to false
  //     .finally(() => client.disconnect());
  // };
  // getNamesRecentTabMsgs = (msgArr) => {
  //   let ownerarrayOfOwnerIds = msgArr.map((doc) => {
  //     return doc.$ownerId;
  //   });

  //   let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

  //   let arrayOfOwnerIds = [...setOfOwnerIds];

  //   arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
  //     Buffer.from(Identifier.from(item))
  //   );

  //   console.log("Calling getNamesRecentTabMsgs");

  //   const clientOpts = {
  //     network: this.props.whichNetwork,
  //     apps: {
  //       DPNS: {
  //         contractId: this.state.DataContractDPNS,
  //       },
  //     },
  //   };
  //   const client = new Dash.Client(clientOpts);

  //   const getNameDocuments = async () => {
  //     return client.platform.documents.get("DPNS.domain", {
  //       where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
  //       orderBy: [["records.dashUniqueIdentityId", "asc"]],
  //     });
  //   };

  //   getNameDocuments()
  //     .then((d) => {
  //       //WHAT IF THERE ARE NO NAMES?
  //       if (d.length === 0) {
  //         console.log("No DPNS domain documents retrieved.");
  //       }

  //       let nameDocArray = [];

  //       for (const n of d) {
  //         console.log("NameDoc:\n", n.toJSON());

  //         nameDocArray = [n.toJSON(), ...nameDocArray];
  //       }
  //       console.log(nameDocArray);

  //       let tupleArray = []; //<- Final array

  //       // My 2 arrays are: nameDocArray and msgArr
  //       //There may not be very many name docs because same author for lots of msgs..

  //       tupleArray = msgArr.map((msg) => {
  //         let tuple = "";

  //         for (let nameDoc of nameDocArray) {
  //           if (nameDoc.$ownerId === msg.$ownerId) {
  //             tuple = [nameDoc.label, msg];
  //             break;
  //           }
  //         }
  //         if (tuple !== "") {
  //           return tuple;
  //         }

  //         return ["No Name Avail..", msg];
  //       });
  //       //HAVE TO SORT THE MSGS AND NAMES TOGETHER BC THEY DON'T COME TOGETHER WELL.

  //       console.log("Tuple!");
  //       console.log(tupleArray);

  //       this.setState({
  //         tuplesRecentToDisplay: tupleArray,
  //         isLoadingRecentTab: false,
  //       });
  //     })
  //     .catch((e) => {
  //       console.error("Something went wrong:\n", e);

  //       this.setState({
  //         Loading: false,
  //       });
  //     })
  //     .finally(() => client.disconnect());
  // };
  // //LINKED FUNCTIONS -  END

  //NamesNamesNamesNamesNamesNamesNamesNamesNamesNamesNamesNamesNamesNames

  getNamesforDGTinvites = (msgArr) => {
    if (msgArr.length === 0) {
      console.log("No Others Invites");
      this.setState({
        isLoading: false,
        isLoadingOthersInvites: false,
        isLoadingRefresh: false,
      });
    } else {
      console.log("Others Invites:");
      console.log(msgArr);

      let ownerarrayOfOwnerIds = msgArr.map((doc) => {
        return doc.$ownerId;
      });

      let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

      let arrayOfOwnerIds = [...setOfOwnerIds];

      arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
        Buffer.from(Identifier.from(item))
      );

      console.log("Calling getNamesforDGTInvites");

      const clientOpts = {
        network: this.state.whichNetwork,
        apps: {
          DPNS: {
            contractId: this.state.DataContractDPNS,
          },
        },
      };
      const client = new Dash.Client(clientOpts);

      const getNameDocuments = async () => {
        return client.platform.documents.get("DPNS.domain", {
          where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
          orderBy: [["records.dashUniqueIdentityId", "asc"]],
        });
      };

      getNameDocuments()
        .then((d) => {
          if (d.length === 0) {
            console.log("No DPNS domain documents retrieved.");
          }

          let nameDocArray = [];

          for (const n of d) {
            //console.log("NameDoc:\n", n.toJSON());

            nameDocArray = [n.toJSON(), ...nameDocArray];
          }
          console.log(nameDocArray);

          let tupleArray = []; //<- Final array

          tupleArray = msgArr.map((msg) => {
            let tuple = "";

            for (let nameDoc of nameDocArray) {
              if (nameDoc.$ownerId === msg.$ownerId) {
                tuple = [nameDoc.label, msg];
                break;
              }
            }
            if (tuple !== "") {
              return tuple;
            }

            return ["No Name Avail..", msg];
          });
          console.log("Tuple for Display");
          console.log(tupleArray);

          this.setState(
            {
              othersInvitesToDisplay: tupleArray,
              isLoading: false,
      isLoadingOthersInvites: false,
              isLoadingRefresh: false,
            }
          );
        })
        .catch((e) => {
          console.error("Something went wrong:\n", e);

          this.setState({
            isLoading: false,

      isLoadingOthersInvites: false,
            isLoadingRefresh: false,
          });
        })
        .finally(() => client.disconnect());
    } //this is to close the else statement
  };

  getIdentityInfo = (theIdentity) => {
    console.log("Called get id info");

    const client = new Dash.Client({ network: this.state.whichNetwork });

    const retrieveIdentity = async () => {
      return client.platform.identities.get(theIdentity); // Your identity ID
    };

    retrieveIdentity()
      .then((d) => {
        console.log("Identity retrieved:\n", d.toJSON());

        this.setState({
          identityRaw: d,
          identityInfo: d.toJSON(),

          isLoading: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);

        this.setState({
          isLoading: false,
        });
      })
      .finally(() => client.disconnect());
  };

  ///***************************************************** */
  //This below will be the INVITE DOCUMENT CREATION
  //##################################################

  submitCreateGroup = (newGroup) => { //Its just a name.
    this.setState({
      isLoadingRefresh: true,
    });

    let namesOfGroups = this.state.dgtAcceptedInvites.map((invite) => {
      return invite.group;
    });
    //this stuff makes sure I dont send 2nd invite to myself
    if (namesOfGroups.includes(newGroup)) {
      this.setState({
        isLoadingRefresh: false,
      });

    } else {
      //ADD INVITE TO DISPLAY AND CONTINUE TO DISPLAY UNTIL RETURNED

      const clientOpts = {
        network: this.state.whichNetwork,
        wallet: {
          mnemonic: this.state.mnemonic,
          unsafeOptions: {
            skipSynchronizationBeforeHeight: this.state.mostRecentBlockHeight,
            //change to what the actual block height
          },
        },
        apps: {
          DGTContract: {
            contractId: this.state.DataContractDGT,
          },
        },
      };
      const client = new Dash.Client(clientOpts);

      const submitInvite = async () => {
        const { platform } = client;

        //const identity = await platform.identities.get(this.state.identity); // Your identity ID
        const identity = this.state.identityRaw;

        const docProperties = {
          group: newGroup,
          toId: Buffer.from(Identifier.from(this.state.identity)),
          dgt: 'self',
        };

        // Create the note document
        const dgtDocument = await platform.documents.create(
          "DGTContract.dgtinvite", 
          identity,
          docProperties
        );


        const documentBatch = {
          create: [dgtDocument], // Document(s) to create
          replace: [], // Document(s) to update
          delete: [], // Document(s) to delete
        };
        // Sign and submit the document(s)
        return platform.documents.broadcast(documentBatch, identity);
      };

      submitInvite()
        .then((d) => {
          //let submittedDoc = d.toJSON();
          this.setState(
            { stagedAcceptedInvites: 
              this.state.stagedAcceptedInvites.slice(0,-1),
              isLoadingRefresh: false,
            }
          );

        })
        .catch((e) => {
          console.error("Something went wrong:\n", e);
          this.setState({stagedAcceptedInvites: 
            this.state.stagedAcceptedInvites.slice(0,-1),
            dgtAcceptedInvites: this.state.dgtAcceptedInvites.slice(1),
            isLoadingRefresh: false,
            errorToDisplay: true
          });
        })
        .finally(() => client.disconnect());
    } // This is the close of the else statment

    //###################################
    this.addGroup(newGroup); // <- This where set isLoadingRefresh: false
    //##################################
  };

  addGroup = (groupName) => { //just a name

    // To handle if you joined a group to remove from Your invites 
    let namesOfGroups = this.state.othersInvitesToDisplay.map((invite) => {
      return invite[1].group;
    });

    console.log('others groups', namesOfGroups);
    console.log('groupName', groupName);

    if (namesOfGroups.includes(groupName)) {

      let groupIndex = namesOfGroups.indexOf(groupName);
      console.log('groupIndex', groupIndex);

      let mutableArray = this.state.othersInvitesToDisplay;
      mutableArray.splice(groupIndex,1);

      this.setState({
          othersInvitesToDisplay: mutableArray,
      });
    }

     // ^^^ To handle if you joined a group to remove from Your invites 

    let group = {
      group: groupName,
      $createdAt: Date.now(),
    };

    this.setState({
      dgtAcceptedInvites: [group, ...this.state.dgtAcceptedInvites],
      stagedAcceptedInvites: [group, ...this.state.stagedAcceptedInvites],
    });

    //ALSO RECALL THE IDENTITY SO THAT IT WILL UPDATE THE cREDITS QUANTS
    //-> Not done yet -> ....
  }; 

  deleteGroup = (groupRemove) => { //Just a name
    this.hideGroupPage();


    this.setState({
      isLoadingRefresh: true, 
      stagedRemovedInvitesNames: [groupRemove, ...this.state.stagedRemovedInvitesNames]
    });

    //create a group to remove array for before display ->
    //Find the groupName of the doc and return the docId -> DONE

    let document = this.state.dgtRawInvites.find((invite) => {
      return (
        groupRemove === invite.toJSON().group &&
        invite.toJSON().$ownerId === this.state.identity
      );
    });
    console.log(document);

    //let documentId = document.$id;

    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: this.state.mnemonic,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: this.state.mostRecentBlockHeight,
        },
      },
      apps: {
        DGTContract: {
          contractId: this.state.DataContractDGT,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const deleteDocument = async () => {
      const { platform } = client;
      const identity = this.state.identityRaw;


      // Sign and submit the document delete transition
      return platform.documents.broadcast({ delete: [document] }, identity);
    };


    let namesOfGroups = this.state.dgtAcceptedInvites.map((invite) => {
      return invite.group;
    });

    if (namesOfGroups.includes(groupRemove)) {

      let groupIndex = namesOfGroups.indexOf(groupRemove);

      let mutableArray = this.state.dgtAcceptedInvites;
      mutableArray.splice(groupIndex,1);

      this.setState({
          dgtAcceptedInvites: mutableArray,
          isLoadingRefresh: false, 
      });
    }

    deleteDocument()
      .then((d) => {
        console.log("Document deleted:\n", d.toJSON());
        this.setState(
          {
            isLoadingRefresh: false,
      stagedRemovedInvitesNames:
       this.state.stagedRemovedInvitesNames.slice(0,-1),
          }
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingRefresh: false,
        });
      })
      .finally(() => client.disconnect());
  };


  // verifyCreatedAtandTimeStamp = () => {
  //   //Possible to spoof with timeStamp
  // };

  render() {

    this.state.mode === "primary"
      ? (document.body.style.backgroundColor = "rgb(280,280,280)")
      : (document.body.style.backgroundColor = "rgb(20,20,20)");

    this.state.mode === "primary"
      ? (document.body.style.color = "black")
      : (document.body.style.color = "white");

    return (
      <>
        <TopNav
          handleMode={this.handleMode}
          mode={this.state.mode}
          showModal={this.showModal}
          whichNetwork={this.state.whichNetwork}
          isLoggedIn={this.state.isLoggedIn}
          toggleExpandedNav={this.toggleExpandedNav}
          expandedTopNav={this.state.expandedTopNav}
        />
        <Image fluid="true" id="dash-bkgd" src={DashBkgd} alt="Dash Logo" />

        {!this.state.isLoggedIn ? (
          <>
            <LandingPage />
            <LoginBottomNav mode={this.state.mode} showModal={this.showModal} />
            <Footer />
          </>
        ) : this.state.isGroupShowing ? (
          <>

            <GroupPage
              uniqueName={this.state.uniqueName}
              identityRaw={this.state.identityRaw}
              mnemonic={this.state.mnemonic}
              mostRecentBlockHeight={this.state.mostRecentBlockHeight}
              isLoadingGroup={this.state.isLoadingGroup}

              handleRemoveStagedMsgs={this.handleRemoveStagedMsgs}
              handleStagedMsgs={this.handleStagedMsgs}
              stagedGroupMsgs={this.state.stagedGroupMsgs}

              showDeleteModal={this.showModal}
              selectedGroup={this.state.selectedGroup}
              whichNetwork={this.state.whichNetwork}
              mode={this.state.mode}
              hideGroupPage={this.hideGroupPage}
              DataContractDGT={this.state.DataContractDGT}
              DataContractDPNS={this.state.DataContractDPNS}
            />
          </>
        ) : (
          <>
          {this.state.errorToDisplay ? (
              <>
                <p></p>
                <Alert variant="danger" dismissible>
                  <Alert.Heading>Invite Failed</Alert.Heading>
                  <p>
                    You either have insufficient credits or have run into a platform error. Please TopUp credits on DashGetNames or DashGetPaid. Currently, this dapp is platform only so it does not include full wallet access to enable TopUp, but it is planned for future upgrade.
                  </p>
                </Alert>
              </>
            ) : (
              <></>
            )}
            <InvitesPage
              isLoading={this.state.isLoading}
              isLoadingRefresh={this.state.isLoadingRefresh}
              isLoadingOthersInvites={this.state.isLoadingOthersInvites}
              identity={this.state.identity}
              identityInfo={this.state.identityInfo}
              uniqueName={this.state.uniqueName}
              handleSelectedJoinGroup={this.handleSelectedJoinGroup}
              dgtAcceptedInvites={this.state.dgtAcceptedInvites}
              othersInvitesToDisplay={this.state.othersInvitesToDisplay}
              mode={this.state.mode}
              showGroupPage={this.showGroupPage}
              showModal={this.showModal}
            />

            <Footer />

            {!this.state.isLoading &&
            this.state.identity !== "No Identity" &&
            this.state.uniqueName !== "Er" ? (
              <BottomNav
                isLoadingRefresh={this.state.isLoadingRefresh}
                closeExpandedNavs={this.closeExpandedNavs}
                handleGetInvitesAndGetIdInfo={this.handleGetInvitesAndGetIdInfo}
                mode={this.state.mode}
                showModal={this.showModal}
              />
            ) : (
              <></>
            )}
          </>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "CreateGroupModal" ? (
          <CreateGroupModal
            submitCreateGroup={this.submitCreateGroup}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeExpandedNavs={this.closeExpandedNavs}
          />
        ) : (
          <></>
        )}

{this.state.isModalShowing &&
        this.state.presentModal === "DeleteGroupModal" ? (
          <DeleteGroupModal
            selectedGroup={this.state.selectedGroup}
            deleteGroup={this.deleteGroup}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeExpandedNavs={this.closeExpandedNavs}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "JoinGroupModal" ? (
          <JoinGroupModal
          submitCreateGroup={this.submitCreateGroup}
          selectedGroup={this.state.selectedGroup}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeExpandedNavs={this.closeExpandedNavs}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "LoginSignupModal" ? (
          <LoginSignupModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            handleLoginwithMnem={this.handleLoginwithMnem}
            closeExpandedNavs={this.closeExpandedNavs}
          />
        ) : (
          <></>
        )}


        {this.state.isModalShowing &&
        this.state.presentModal === "LogoutModal" ? (
          <LogoutModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            handleLogout={this.handleLogout}
            closeExpandedNavs={this.closeExpandedNavs}
          />
        ) : (
          <></>
        )}

{this.state.isModalShowing &&
        this.state.presentModal === "ActiveGroupsModal" ? (
          <ActiveGroupsModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeExpandedNavs={this.closeExpandedNavs}
          />
        ) : (
          <></>
        )}

        

        {/* {this.state.isModalShowing &&
        this.state.presentModal === "TopUpIdentityModal" ? (
          <TopUpIdentityModal
            triggerTopUpLoading={this.triggerTopUpLoading}
            updateCreditsAfterTopUp={this.updateCreditsAfterTopUp}
            mnemonic={this.state.mnemonic}
            whichNetwork={this.state.whichNetwork}
            skipSynchronizationBeforeHeight={
              this.state.skipSynchronizationBeforeHeight
            }
            identity={this.state.identity}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeExpandedNavs={this.closeExpandedNavs}
          />
        ) : (
          <></>
        )} */}
      </>
    );
  }
}

export default App;
