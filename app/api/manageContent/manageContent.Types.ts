import { Banner } from "../addBanner/banner";

export interface ManageContentTypes {
  privacyPolicyHeading: string;
  privacyPolicy: string;
  termsConditions: string;
  jobCoverLetter: string;
  coverLetterFieldName: string;
  appointment: string;
  appointmentFieldName: string;
  heading: string;
  subHeading: string;
  bottomBarText: string;
  contactInfo: string;
  customColor: string;
  id: string;
}
export interface ManageContentEditTypes {
  privacyPolicyHeading?: string;
  privacyPolicy?: string;
  termsConditions?: string;
  jobCoverLetter?: string;
  coverLetterFieldName?: string;
  appointment?: string;
  appointmentFieldName?: string;
  heading?: string;
  subHeading?: string;
  bottomBarText?: string;
  contactInfo?: string;
  customColor?: string;
  id: string;
}
export interface ManageAlert {
  [key: string]: any;
  _id: string;
  heading: string;
  subheading: string;
  image: string;
}
export interface Media {
  _id: string;
  type: string;
  fileName: string;
  filepath: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface HomeContent {
  _id: string;
  __v: number;
  bannerCustomColor: string;
  blockCustomColor: string;
  companyCustomColor: string;
  createdAt: string;
  galleryCustomColor: string;
  tips_url_1: string;
  tips_url_2: string;
  tips_url_3: string;
  updatedAt: string;
  mailChimpLogo: Media;
  tips_1: Media;
  tips_2: Media;
  tips_3: Media;
}
export interface JobMarketContent {
  heading?: string;
  description?: string;
  id: string;
  linkText?: string;
  linkUrl?: string;
}

export interface ApplyFormContent {
  name: string;
  email: string;
  number: string;
  about_me: string;
  letter: string;
}

export interface FooterContentType {
  _id: string;
  heading1: string;
  section1Title: string;
  section1Address: string;
  section1Phone: string;
  section1Email: string;
  section1WorkingHours: string;
  heading2: string;
  section2Title: string;
  section2Address: string;
  section2Phone: string;
  section2Email: string;
  section2WorkingHours: string;
  heading3: string;
  section3Title: string;
  section3Links: string;
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  borderColor: string;
}

export interface FooterContent {
  _id: string;
  section1Title: string;
  section1Address: string;
  section1Phone: string;
  section1Email: string;
  section1WorkingHours: string;
  section2Title: string;
  section2Address: string;
  section2Phone: string;
  section2Email: string;
  section2WorkingHours: string;
  section3Title: string;
  section3Links: string;
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  borderColor: string;
}

export interface ContactModelType {
  _id: string;
  heading: string;
  subHeading: string;
  text: string;
  firstInputText: string;
  secondInputText: string;
  thirdInputText: string;
  fourthInputText: string;
  bottomHeading: string;
  firstCheckboxText: string;
  secondCheckboxText: string;
  thirdCheckboxText: string;
  fourthCheckboxText: string;
  submitButtonText: string;
  content: string;
}

export interface ContactModel {
  _id: string;
  heading: string;
  subHeading: string;
  text: string;
  firstInputText: string;
  secondInputText: string;
  thirdInputText: string;
  fourthInputText: string;
  bottomHeading: string;
  firstCheckboxText: string;
  secondCheckboxText: string;
  thirdCheckboxText: string;
  submitButtonText: string;
}

export interface MagazineContact {
  _id: string;
  inputKey: string;
  inputKey1: string;
  inputKey2: string;
  inputKey3: string;
  inputKey4: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

export interface MagazineContactType {
  _id: string;
  inputKey: string;
  inputKey1: string;
  inputKey2: string;
  inputKey3: string;
  inputKey4: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

export interface GoogleMapType {
  _id: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
}

export interface CompanyContent {
  content: string;
  advertisement: string;
  owner: string;
  industry: string;
  companyInfo: string;
  website: string;
  contact: string;
  address: string;
}
export interface SideBarContent {
  menu_1: string;
  menu_2: string;
  menu_3: string;
  menu_4: string;
  contact_label: string;
  contact_below_content: string;
  id: string;
}

export interface Accordion {
  heading: string;
  content: string;
  _id?: string;
}
export interface AccordionPayLoadForApi {
  accordion: Accordion[];
  accordionTitle: string;
}

export interface IconSectionPayLoadForAPi {
  heading: string;
  subHeading: string;
  image: any;
}

export interface FaqHeaderPayloadForAPi {
  heading: string;
  title: string;
  image: any;
}

export interface FAQ {
  _id: string;
  accordion: Accordion[];
  accordionTitle: string;
  iconSection: IconSectionPayLoadForAPi | null;
  cards: CardContentI[];
  header: FaqHeaderPayloadForAPi | null;
}

export interface CardContentI {
  title: string;
  link: string;
  image: any;
  _id: string;
  oldImage?: string;
}
//about us manage content
export interface AboutBanner {
  image: any;
  text: string;
  oldImage: any;
}
export interface AboutTextBlock {
  topHeading: string;
  sideHeading: string;
  text: string;
}

export interface AboutFeature {
  _id: string;
  text: string;
}

export interface AboutOurCustomer {
  _id: string;
  url: string;
  image: any;
}

export interface AboutMarketingCard {
  _id: string;
  heading: string;
  text: string;
}

export interface Slider {
  _id: string;
  image: any;
  oldImage?: any;
}

export interface CareerFairCard {
  _id: string;
  heading: string;
  image: any;
  text: string;
}

export interface Exhibitor extends Slider {}

export interface ContactCard extends CareerFairCard {}

export interface CalenderSection {
  sideImage: any;
  headingFirst: string;
  textFirst: string;
  headingTwo: string;
  textTwo: string;
  headingThird: string;
  textThird: string;
  headingForth: string;
  textFourth: string;
  calendlyUrl: string;
  oldImages?: any;
}

export interface MediaCard {
  _id: string;
  headingFirst: string;
  headingSecond: string;
  buttonHeading: string;
  url: string;
}

export interface OfferCard {
  _id: string;
  heading: string;
  image: any;
  text: string;
  url: string;
  oldImages?: any;
}

export interface HandleUpdateOperationField {
  banner: string;
  textBlock: string;
  aboutFeature: string;
  marketing: string;
  youTube: string;
  mediaData: string;
  calender: string;
  offerCard: string;
  customer: string;
  slider: string;
  exhibitor: string;
  careerFair: string;
  contact: string;
  twoCards: string;
}

export interface TwoCardInMiddle {
  _id: string;
  heading: string;
  image: any;
  text: string;
  buttonText: string;
  buttonUrl: string;
  buttonColor: string;
}

export interface AboutResponseI {
  banner: AboutBanner | null;
  textBlock: AboutTextBlock | null;
  aboutFeaturesHeadingFirst: string;
  aboutFeaturesHeadingSecond: string;
  aboutFeaturesImage: any;
  features: AboutFeature[];
  marketingFirstHeading: string;
  marketingSecondHeading: string;
  marketingCards: AboutMarketingCard[];
  youTubeHeadingFirst: string;
  youTubeHeadingSecond: string;
  youTubeLinkFirst: string;
  youTubeLinkSecond: string;
  mediaDataHeading: string;
  mediaCards: MediaCard[];
  calender: CalenderSection | null;
  OfferCards: OfferCard[];
  ourCustomers: AboutOurCustomer[];
  slider: Slider[];
  exhibitors: Exhibitor[];
  careerFairFirstHeading: string;
  careerFairSecondHeading: string;
  careerFairCards: CareerFairCard[];
  contactHeadingFirst: string;
  contactHeadingSecond: string;
  contactCard: ContactCard[];
  twoCards: TwoCardInMiddle[];
}
export interface About {
  banner: AboutBanner;
  textBlock: AboutTextBlock;
  aboutFeaturesHeadingFirst: string;
  aboutFeaturesHeadingSecond: string;
  aboutFeaturesImage: any;
  features: AboutFeature[];
  ourCustomers: AboutOurCustomer[];
  marketingFirstHeading: string;
  marketingSecondHeading: string;
  marketingCards: AboutMarketingCard[];
  slider: Slider[];
  careerFairFirstHeading: string;
  careerFairSecondHeading: string;
  careerFairCards: CareerFairCard[];
  exhibitors: Exhibitor[];
  youTubeHeadingFirst: string;
  youTubeHeadingSecond: string;
  youTubeLinkFirst: string;
  youTubeLinkSecond: string;
  contactHeadingFirst: string;
  contactHeadingSecond: string;
  contactCard: ContactCard[];
  calender: CalenderSection;
  mediaDataHeading: string;
  mediaCards: MediaCard[];
  OfferCards: OfferCard[];
  twoCards: TwoCardInMiddle[];
}

//Magazine order types

export interface MagazineOrderResponse {
  header: MagazineHeader | null;
  jobMagazineHeading: string;
  jobMagazineCards: JobMagazineCard[];
  jobMagazinePointHeading: string;
  jobMagazinePointSideImage: any;
  jobMagazinePointText: string;
  jobMagazinePoints: JobMagazinePoint[];
  aboutService: JobMagazineAboutService | null;
}
export interface MagazineOrderUpdateField {
  header: string;
  jobMagazineCard: string;
  jobMagazinePoints: string;
  aboutService: string;
}
export interface MagazineHeader {
  buttonText: string;
  buttonUrl: string;
  buttonColor: string;
  sideText: string;
}
export interface JobMagazineCard {
  _id: string;
  image: any;
  cardHeading: string;
  textFirst: string;
  textSecond: string;
  oldImages?: any;
  additionalText: string;
}

export interface JobMagazinePoint {
  _id: string;
  text: string;
}
export interface JobMagazineAboutService {
  headingFirst: string;
  textFirst: string;
  headingSecond: string;
  textSecond: string;
  buttonText: string;
  buttonUrl: string;
  buttonColor: string;
}
export interface Magazine {
  header: MagazineHeader;
  jobMagazineHeading: string;
  jobMagazineCards: JobMagazineCard[];
  jobMagazinePointHeading: string;
  jobMagazinePointSideImage: any;
  jobMagazinePointText: string;
  jobMagazinePoints: JobMagazinePoint[];
  aboutService: JobMagazineAboutService;
}

//contact us page
export interface ContactUsUpdateField {
  pageHeading: string;
  addressSection: string;
  aboutUs: string;
  counter: string;
  contactCardFirstWithPoints: string;
  ContactCardSecond: string;
  aboutTeam: string;
  contactForm: string;
}

export interface ContactUsAddress {
  placeFirstHeading: string;
  placeFirstText: string;
  telFirstHeading: string;
  telFirstTiming: string;
  telFirstNumber: string;
  placeSecondHeading: string;
  placeSecondText: string;
  telSecondHeading: string;
  telSecondTiming: string;
  telSecondNumber: string;
  EmailHeading: string;
  EmailAddress: string;
  instagramLink: string;
  youTubeLink: string;
}

export interface ContactAboutUs {
  topHeading: string;
  text: string;
  sideImage: any;
  belowHeading: string;
  buttonText: string;
  buttonUrl: string;
  buttonColor: string;
  oldImages?: any;
}

export interface Counter {
  _id: string;
  heading: string;
  count: string;
}
export interface ContactCardWithPoint {
  heading: string;
  point1: string;
  point2: string;
  point3: string;
  point4: string;
  text: string;
  image: any;
  oldImages?: any;
}
export interface ContactCardSecond {
  heading: string;
  text: string;
  image: any;
  buttonText: string;
  buttonUrl: string;
  buttonColor: string;
  oldImages?: any;
}

export interface AboutTeamCard {
  _id: string;
  image: any;
  heading: string;
  subHeading: string;
  buttonText: string;
  buttonUrl: string;
  buttonColor: string;
  oldImages?: any;
}

export interface ContactUsContactForm {
  heading: string;
  buttonText: string;
  text: string;
}
export interface ContactUs {
  pageHeadingInGermany: string;
  contactForm: ContactUsContactForm;
  address: ContactUsAddress;
  aboutUs: ContactAboutUs;
  counterHeading: string;
  counters: Counter[];
  contactCardFirstWithPoints: ContactCardWithPoint;
  ContactCardSecond: ContactCardSecond;
  aboutTeamHeading: string;
  aboutTeamSubHeading: string;
  aboutTeamCard: AboutTeamCard[];
}
export interface ContactUResponseType {
  pageHeadingInGermany: string;
  address: ContactUsAddress | null;
  aboutUs: ContactAboutUs | null;
  counterHeading: string;
  counters: Counter[];
  contactCardFirstWithPoints: ContactCardWithPoint | null;
  ContactCardSecond: ContactCardSecond | null;
  aboutTeamHeading: string;
  aboutTeamSubHeading: string;
  aboutTeamCard: AboutTeamCard[];
  contactForm: ContactUsContactForm | null;
}

// job wall content

export interface JobWallBanner {
  heading?: string;
  subHeading?: string;
  image?: any;
  oldImages?: any;
}

export interface JobWallContent {
  banner: JobWallBanner | null;
  contactPersonIcon: any;
  industryIcon: any;
  locationIcon: any;
  ioldImage?: any;
  coldImage?: any;
  loldImage?: any;
}
export interface JobWallUpdateField {
  banner: string;
  contactPersonIcon: string;
  industryIcon: string;
  locationIcon: string;
}

//===================home page dynamic content==================
export interface YoutubeSection {
  heading: string;
  text: string;
  videoLink: string;
  backgroundColor: string;
}
export interface Card {
  _id: string;
  link: string;
  image: any;
}
export interface SearchBarContent {
  heading: string;
}

export interface TopStateContent {
  heading: string;
}
export interface FederalStateContent {
  heading: string;
}

export interface GalleryContent {
  heading: string;
  backgroundColor: string;
}

export interface TextContainer {
  text1?: string;
  text2?: string;
  image?: any;
  logoGalleryColor?: string;
  oldImages?: any;
}

export interface MailChimpSection {
  image?: any;
  heading?: string;
  text1?: string;
  text2?: string;
  buttonText?: string;
  oldImages?: any;
}

export interface WelcomeMessageForApp {
  heading: string;
  subHeading: string;
  text: string;
}
export interface HomePage {
  youtubeSection: YoutubeSection | null;
  cardHeading: string;
  cardText: string;
  CardBackgroundColor: string;
  cards: Card[];
  searchBar: SearchBarContent | null;
  topState: TopStateContent | null;
  federalState: FederalStateContent | null;
  gallery: GalleryContent | null;
  textContainer: TextContainer | null;
  companyLogoHeading: string;
  logoGalleryColor: any;
  mailChimpSection: MailChimpSection | null;
  headerLogoSideImage: any;
  welcomeMessageForApp: WelcomeMessageForApp | null;
  sideImage: any;
  oldSideImage?: any;
  oldHeaderSideImage?: any;
}

export interface HomePageOperationField {
  youtubeSection: string;
  cardSection: string;
  searchBar: string;
  topState: string;
  federalState: string;
  gallery: string;
  textContainer: string;
  emailSection: string;
  companiesLogo: string;
  headerLogoSideImage: string;
  welcomeMessageForApp: string;
}

//===========email content==================
export interface JobApplication {
  upperContent: string;
  lowerContent: string;
  coverLetterDynamicText: string;
}
export interface CompanyAppointment {
  upperContent: string;
  lowerContent: string;
  appointmentLetterDynamicText: string;
}
export interface EmailContent {
  application: JobApplication | null;
  appointment: CompanyAppointment | null;
}
