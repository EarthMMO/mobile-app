import create from "zustand";
import { devtools } from "zustand/middleware";

const userStore = (set) => ({
  // we update this when we make API call to get basic details
  user: {
    ethereumAddress: "",
    userId: null,
    jwt: "",
    isSignedIn: false,
    //  email: "",
    //  userId: "",
    //  isRegistrationComplete: false,
    //  isPasswordCreated: false,
    //  isEmailVerified: false,
    //  isMobileVerified: false,
    //  isKYCComplete: false,
  },
  // We update this to object as user will continue filling the form
  //personalData: null,
  //companyData: null,
  //contactData: null,
  //tokenizedPassword: null,
  //kybReferenceID: "",
  //kybStatus: "NOT_STARTED",
  //userStateValidated: false,
  //registrationPath: "PERSONAL_DETAILS",

  // update functions
  updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })), // here data can be subset of all the properties of user

  //updatePersonalData: (data) => set((state) => ({ personalData: data })),

  //updateRegistrationPath: (data) =>
  //  set((state) => ({ registrationPath: data })),

  //updateCompanyData: (data) => set((state) => ({ companyData: data })),

  //updateContactData: (data) => set((state) => ({ contactData: data })),

  //updateTokenizedPassword: (data) =>
  //  set((state) => ({ tokenizedPassword: data })),

  //updateKybReferenceID: (data) => set((state) => ({ kybReferenceID: data })),

  //updateKybStatus: (data) => set((state) => ({ kybStatus: data })),

  //updateUserStateValidated: (data) =>
  //  set((state) => ({ userStateValidated: data })),
});

// this will help us to see the state values in redux dev tools !!!
let tempUserStore = devtools(userStore);

const useUserStore = create(devtools(tempUserStore));

export default useUserStore;
