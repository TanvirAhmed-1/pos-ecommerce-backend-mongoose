import {
  DivisionModel,
  DistrictModel,
  UpazilaModel,
  ShippingSettingModel,
} from "../modules/shipping/shipping.model";

// Complete dataset for Bangladesh 8 Divisions
export const BD_DIVISIONS_DATA = [
  { name: "Dhaka", bnName: "ঢাকা", order: 1 },
  { name: "Chattogram", bnName: "চট্টগ্রাম", order: 2 },
  { name: "Rajshahi", bnName: "রাজশাহী", order: 3 },
  { name: "Khulna", bnName: "খুলনা", order: 4 },
  { name: "Barishal", bnName: "বরিশাল", order: 5 },
  { name: "Sylhet", bnName: "সিলেট", order: 6 },
  { name: "Rangpur", bnName: "রংপুর", order: 7 },
  { name: "Mymensingh", bnName: "ময়মনসিংহ", order: 8 },
];

// Complete dataset for 64 Districts mapped to their respective divisions
export const BD_DISTRICTS_DATA = [
  // Dhaka Division
  { name: "Dhaka", bnName: "ঢাকা", division: "Dhaka", isInsideDhaka: true, deliveryCharge: 70, expressDeliveryCharge: 120, estimatedDeliveryDays: "1-2 Days" },
  { name: "Gazipur", bnName: "গাজীপুর", division: "Dhaka", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-3 Days" },
  { name: "Narayanganj", bnName: "নারায়ণগঞ্জ", division: "Dhaka", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-3 Days" },
  { name: "Tangail", bnName: "টাঙ্গাইল", division: "Dhaka", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Kishoreganj", bnName: "কিশোরগঞ্জ", division: "Dhaka", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Manikganj", bnName: "মানিকগঞ্জ", division: "Dhaka", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Munshiganj", bnName: "মুন্সীগঞ্জ", division: "Dhaka", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Narsingdi", bnName: "নরসিংদী", division: "Dhaka", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Faridpur", bnName: "ফরিদপুর", division: "Dhaka", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Gopalganj", bnName: "গোপালগঞ্জ", division: "Dhaka", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Madaripur", bnName: "মাদারীপুর", division: "Dhaka", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Rajbari", bnName: "রাজবাড়ী", division: "Dhaka", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Shariatpur", bnName: "শরীয়তপুর", division: "Dhaka", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },

  // Chattogram Division
  { name: "Chattogram", bnName: "চট্টগ্রাম", division: "Chattogram", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-3 Days" },
  { name: "Cox's Bazar", bnName: "কক্সবাজার", division: "Chattogram", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "3-5 Days" },
  { name: "Cumilla", bnName: "কুমিল্লা", division: "Chattogram", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-3 Days" },
  { name: "Feni", bnName: "ফেনী", division: "Chattogram", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-3 Days" },
  { name: "Brahmanbaria", bnName: "ব্রাহ্মণবাড়িয়া", division: "Chattogram", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Chandpur", bnName: "চাঁদপুর", division: "Chattogram", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Noakhali", bnName: "নোয়াখালী", division: "Chattogram", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Lakshmipur", bnName: "লক্ষ্মীপুর", division: "Chattogram", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Khagrachhari", bnName: "খাগড়াছড়ি", division: "Chattogram", isInsideDhaka: false, deliveryCharge: 140, expressDeliveryCharge: 200, estimatedDeliveryDays: "3-5 Days" },
  { name: "Rangamati", bnName: "রাঙ্গামাটি", division: "Chattogram", isInsideDhaka: false, deliveryCharge: 140, expressDeliveryCharge: 200, estimatedDeliveryDays: "3-5 Days" },
  { name: "Bandarban", bnName: "বান্দরবান", division: "Chattogram", isInsideDhaka: false, deliveryCharge: 140, expressDeliveryCharge: 200, estimatedDeliveryDays: "3-5 Days" },

  // Rajshahi Division
  { name: "Rajshahi", bnName: "রাজশাহী", division: "Rajshahi", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Bogura", bnName: "বগুড়া", division: "Rajshahi", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-3 Days" },
  { name: "Pabna", bnName: "পাবনা", division: "Rajshahi", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Sirajganj", bnName: "সিরাজগঞ্জ", division: "Rajshahi", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Naogaon", bnName: "নওগাঁ", division: "Rajshahi", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Natore", bnName: "নাটোর", division: "Rajshahi", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Chapainawabganj", bnName: "চাঁপাইনবাবগঞ্জ", division: "Rajshahi", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Joypurhat", bnName: "জয়পুরহাট", division: "Rajshahi", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },

  // Khulna Division
  { name: "Khulna", bnName: "খুলনা", division: "Khulna", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Jashore", bnName: "যশোর", division: "Khulna", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Kushtia", bnName: "কুষ্টিয়া", division: "Khulna", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Jhenaidah", bnName: "ঝিনাইদহ", division: "Khulna", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Satkhira", bnName: "সাতক্ষীরা", division: "Khulna", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Bagerhat", bnName: "বাগেরহাট", division: "Khulna", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Chuadanga", bnName: "চুয়াডাঙ্গা", division: "Khulna", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Meherpur", bnName: "মেহেরপুর", division: "Khulna", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Magura", bnName: "মাগুরা", division: "Khulna", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Narail", bnName: "নড়াইল", division: "Khulna", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },

  // Barishal Division
  { name: "Barishal", bnName: "বরিশাল", division: "Barishal", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Bhola", bnName: "ভোলা", division: "Barishal", isInsideDhaka: false, deliveryCharge: 140, expressDeliveryCharge: 190, estimatedDeliveryDays: "3-5 Days" },
  { name: "Patuakhali", bnName: "পটুয়াখালী", division: "Barishal", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "3-5 Days" },
  { name: "Pirojpur", bnName: "পিরোজপুর", division: "Barishal", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Barguna", bnName: "বরগুনা", division: "Barishal", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "3-5 Days" },
  { name: "Jhalokathi", bnName: "ঝালকাঠি", division: "Barishal", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },

  // Sylhet Division
  { name: "Sylhet", bnName: "সিলেট", division: "Sylhet", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Moulvibazar", bnName: "মৌলভীবাজার", division: "Sylhet", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Habiganj", bnName: "হবিগঞ্জ", division: "Sylhet", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Sunamganj", bnName: "সুনামগঞ্জ", division: "Sylhet", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "3-5 Days" },

  // Rangpur Division
  { name: "Rangpur", bnName: "রংপুর", division: "Rangpur", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Dinajpur", bnName: "দিনাজপুর", division: "Rangpur", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Gaibandha", bnName: "গাইবান্ধা", division: "Rangpur", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Kurigram", bnName: "কুড়িগ্রাম", division: "Rangpur", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "3-5 Days" },
  { name: "Lalmonirhat", bnName: "লালমনিরহাট", division: "Rangpur", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "3-5 Days" },
  { name: "Nilphamari", bnName: "নীলফামারী", division: "Rangpur", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Panchagarh", bnName: "পঞ্চগড়", division: "Rangpur", isInsideDhaka: false, deliveryCharge: 140, expressDeliveryCharge: 190, estimatedDeliveryDays: "3-5 Days" },
  { name: "Thakurgaon", bnName: "ঠাকুরগাঁও", division: "Rangpur", isInsideDhaka: false, deliveryCharge: 140, expressDeliveryCharge: 190, estimatedDeliveryDays: "3-5 Days" },

  // Mymensingh Division
  { name: "Mymensingh", bnName: "ময়মনসিংহ", division: "Mymensingh", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Jamalpur", bnName: "জামালপুর", division: "Mymensingh", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Netrokona", bnName: "নেত্রকোণা", division: "Mymensingh", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
  { name: "Sherpur", bnName: "শেরপুর", division: "Mymensingh", isInsideDhaka: false, deliveryCharge: 130, expressDeliveryCharge: 180, estimatedDeliveryDays: "2-4 Days" },
];

// Curated comprehensive Upazilas and Metropolitan Areas for all 64 districts
export const BD_UPAZILAS_DATA: { district: string; name: string; bnName: string }[] = [
  // --- DHAKA DISTRICT (Includes Metro areas + Rural Upazilas) ---
  { district: "Dhaka", name: "Gulshan", bnName: "গুলশান" },
  { district: "Dhaka", name: "Banani", bnName: "বনানী" },
  { district: "Dhaka", name: "Dhanmondi", bnName: "ধানমন্ডি" },
  { district: "Dhaka", name: "Uttara", bnName: "উত্তরা" },
  { district: "Dhaka", name: "Mirpur", bnName: "মিরপুর" },
  { district: "Dhaka", name: "Mohammadpur", bnName: "মোহাম্মদপুর" },
  { district: "Dhaka", name: "Badda", bnName: "বাড্ডা" },
  { district: "Dhaka", name: "Baridhara", bnName: "বারিধারা" },
  { district: "Dhaka", name: "Bashundhara R/A", bnName: "বসুন্ধরা আ/এ" },
  { district: "Dhaka", name: "Motijheel", bnName: "মতিঝিল" },
  { district: "Dhaka", name: "Paltan", bnName: "পল্টন" },
  { district: "Dhaka", name: "Khilgaon", bnName: "খিলগাঁও" },
  { district: "Dhaka", name: "Malibagh", bnName: "মালিবাগ" },
  { district: "Dhaka", name: "Moghbazar", bnName: "মগবাজার" },
  { district: "Dhaka", name: "Rampura", bnName: "রামপুরা" },
  { district: "Dhaka", name: "Tejgaon", bnName: "তেজগাঁও" },
  { district: "Dhaka", name: "Old Dhaka (Lalbagh/Kotwali)", bnName: "পুরান ঢাকা" },
  { district: "Dhaka", name: "Jatrabari", bnName: "যাত্রাবাড়ী" },
  { district: "Dhaka", name: "Keraniganj", bnName: "কেরানীগঞ্জ" },
  { district: "Dhaka", name: "Savar", bnName: "সাভার" },
  { district: "Dhaka", name: "Dhamrai", bnName: "ধামরাই" },
  { district: "Dhaka", name: "Dohar", bnName: "দোহার" },
  { district: "Dhaka", name: "Nawabganj", bnName: "নবাবগঞ্জ" },
  { district: "Dhaka", name: "Ashulia", bnName: "আশুলিয়া" },

  // --- GAZIPUR ---
  { district: "Gazipur", name: "Gazipur Sadar", bnName: "গাজীপুর সদর" },
  { district: "Gazipur", name: "Kaliakair", bnName: "কালিয়াকৈর" },
  { district: "Gazipur", name: "Kapasia", bnName: "কাপাসিয়া" },
  { district: "Gazipur", name: "Sreepur", bnName: "শ্রীপুর" },
  { district: "Gazipur", name: "Kaliganj", bnName: "কালীগঞ্জ" },
  { district: "Gazipur", name: "Tongi", bnName: "টঙ্গী" },

  // --- NARAYANGANJ ---
  { district: "Narayanganj", name: "Narayanganj Sadar", bnName: "নারায়ণগঞ্জ সদর" },
  { district: "Narayanganj", name: "Bandar", bnName: "বন্দর" },
  { district: "Narayanganj", name: "Rupganj", bnName: "রূপগঞ্জ" },
  { district: "Narayanganj", name: "Sonargaon", bnName: "সোনারগাঁ" },
  { district: "Narayanganj", name: "Araihazar", bnName: "আড়াইহাজার" },

  // --- TANGAIL ---
  { district: "Tangail", name: "Tangail Sadar", bnName: "টাঙ্গাইল সদর" },
  { district: "Tangail", name: "Mirzapur", bnName: "মির্জাপুর" },
  { district: "Tangail", name: "Nagarpur", bnName: "নাগরপুর" },
  { district: "Tangail", name: "Madhupur", bnName: "মধুপুর" },
  { district: "Tangail", name: "Gopalpur", bnName: "গোপালপুর" },
  { district: "Tangail", name: "Ghatail", bnName: "ঘাটাইল" },
  { district: "Tangail", name: "Kalihati", bnName: "কালিহাতী" },
  { district: "Tangail", name: "Sakhipur", bnName: "সখিপুর" },
  { district: "Tangail", name: "Delduar", bnName: "দেলদুয়ার" },
  { district: "Tangail", name: "Basail", bnName: "বাসাইল" },
  { district: "Tangail", name: "Bhuapur", bnName: "ভূঞাপুর" },
  { district: "Tangail", name: "Dhanbari", bnName: "ধনবাড়ী" },

  // --- KISHOREGANJ ---
  { district: "Kishoreganj", name: "Kishoreganj Sadar", bnName: "কিশোরগঞ্জ সদর" },
  { district: "Kishoreganj", name: "Bhairab", bnName: "ভৈরব" },
  { district: "Kishoreganj", name: "Bajitpur", bnName: "বাজিতপুর" },
  { district: "Kishoreganj", name: "Kuliarchar", bnName: "কুলিয়ারচর" },
  { district: "Kishoreganj", name: "Pakundia", bnName: "পাকুন্দিয়া" },
  { district: "Kishoreganj", name: "Katiadi", bnName: "কটিয়াদী" },
  { district: "Kishoreganj", name: "Karimganj", bnName: "করিমগঞ্জ" },
  { district: "Kishoreganj", name: "Tarail", bnName: "তাড়াইল" },
  { district: "Kishoreganj", name: "Hossainpur", bnName: "হোসেনপুর" },
  { district: "Kishoreganj", name: "Itna", bnName: "ইটনা" },
  { district: "Kishoreganj", name: "Mithamain", bnName: "মিঠামইন" },
  { district: "Kishoreganj", name: "Austagram", bnName: "অষ্টগ্রাম" },
  { district: "Kishoreganj", name: "Nikli", bnName: "নিকলী" },

  // --- MANIKGANJ ---
  { district: "Manikganj", name: "Manikganj Sadar", bnName: "মানিকগঞ্জ সদর" },
  { district: "Manikganj", name: "Singair", bnName: "সিংগাইর" },
  { district: "Manikganj", name: "Shivalaya", bnName: "শিবালয়" },
  { district: "Manikganj", name: "Saturia", bnName: "সাটুরিয়া" },
  { district: "Manikganj", name: "Harirampur", bnName: "হরিরামপুর" },
  { district: "Manikganj", name: "Ghior", bnName: "ঘিওর" },
  { district: "Manikganj", name: "Daulatpur", bnName: "দৌলতপুর" },

  // --- MUNSHIGANJ ---
  { district: "Munshiganj", name: "Munshiganj Sadar", bnName: "মুন্সীগঞ্জ সদর" },
  { district: "Munshiganj", name: "Sreenagar", bnName: "শ্রীনগর" },
  { district: "Munshiganj", name: "Sirajdikhan", bnName: "সিরাজদিখান" },
  { district: "Munshiganj", name: "Louhajang", bnName: "লৌহজং" },
  { district: "Munshiganj", name: "Gazaria", bnName: "গজারিয়া" },
  { district: "Munshiganj", name: "Tongibari", bnName: "টংগিবাড়ী" },

  // --- NARSINGDI ---
  { district: "Narsingdi", name: "Narsingdi Sadar", bnName: "নরসিংদী সদর" },
  { district: "Narsingdi", name: "Palash", bnName: "পলাশ" },
  { district: "Narsingdi", name: "Shibpur", bnName: "শিবপুর" },
  { district: "Narsingdi", name: "Raipura", bnName: "রায়পুরা" },
  { district: "Narsingdi", name: "Belabo", bnName: "বেলাবো" },
  { district: "Narsingdi", name: "Monohardi", bnName: "মনোহরদী" },

  // --- FARIDPUR ---
  { district: "Faridpur", name: "Faridpur Sadar", bnName: "ফরিদপুর সদর" },
  { district: "Faridpur", name: "Boalmari", bnName: "বোয়ালমারী" },
  { district: "Faridpur", name: "Alfadanga", bnName: "আলফাডাঙ্গা" },
  { district: "Faridpur", name: "Madhukhali", bnName: "মধুখালী" },
  { district: "Faridpur", name: "Bhanga", bnName: "ভাঙ্গা" },
  { district: "Faridpur", name: "Nagarkanda", bnName: "নগরকান্দা" },
  { district: "Faridpur", name: "Charbhadrasan", bnName: "চরভদ্রাসন" },
  { district: "Faridpur", name: "Sadarpur", bnName: "সদরপুর" },
  { district: "Faridpur", name: "Saltha", bnName: "সালথা" },

  // --- GOPALGANJ ---
  { district: "Gopalganj", name: "Gopalganj Sadar", bnName: "গোপালগঞ্জ সদর" },
  { district: "Gopalganj", name: "Kashiani", bnName: "কাশিয়ানী" },
  { district: "Gopalganj", name: "Kotalipara", bnName: "কোটালীপাড়া" },
  { district: "Gopalganj", name: "Muksudpur", bnName: "মুকসুদপুর" },
  { district: "Gopalganj", name: "Tungipara", bnName: "টুঙ্গিপাড়া" },

  // --- MADARIPUR ---
  { district: "Madaripur", name: "Madaripur Sadar", bnName: "মাদারীপুর সদর" },
  { district: "Madaripur", name: "Shibchar", bnName: "শিবচর" },
  { district: "Madaripur", name: "Kalkini", bnName: "কালকিনি" },
  { district: "Madaripur", name: "Rajoir", bnName: "রাজৈর" },
  { district: "Madaripur", name: "Dasar", bnName: "ডাসার" },

  // --- RAJBARI ---
  { district: "Rajbari", name: "Rajbari Sadar", bnName: "রাজবাড়ী সদর" },
  { district: "Rajbari", name: "Goalanda", bnName: "গোয়ালন্দ" },
  { district: "Rajbari", name: "Pangsha", bnName: "পাংশা" },
  { district: "Rajbari", name: "Baliakandi", bnName: "বালিয়াকান্দি" },
  { district: "Rajbari", name: "Kalukhali", bnName: "কালুখালী" },

  // --- SHARIATPUR ---
  { district: "Shariatpur", name: "Shariatpur Sadar", bnName: "শরীয়তপুর সদর" },
  { district: "Shariatpur", name: "Naria", bnName: "নড়িয়া" },
  { district: "Shariatpur", name: "Zajira", bnName: "জাজিরা" },
  { district: "Shariatpur", name: "Gosairhat", bnName: "গোসাইরহাট" },
  { district: "Shariatpur", name: "Bhedarganj", bnName: "ভেদরগঞ্জ" },
  { district: "Shariatpur", name: "Damudya", bnName: "ডামুড্যা" },

  // --- CHATTOGRAM DISTRICT ---
  { district: "Chattogram", name: "Chattogram Sadar / Kotwali", bnName: "চট্টগ্রাম সদর / কোতোয়ালী" },
  { district: "Chattogram", name: "Panchlaish", bnName: "পাঁচলাইশ" },
  { district: "Chattogram", name: "Agrabad", bnName: "আগ্রাবাদ" },
  { district: "Chattogram", name: "Halishahar", bnName: "হালিশহর" },
  { district: "Chattogram", name: "Khulshi", bnName: "খুলশী" },
  { district: "Chattogram", name: "Sitakunda", bnName: "সীতাকুণ্ড" },
  { district: "Chattogram", name: "Mirsharai", bnName: "মীরসরাই" },
  { district: "Chattogram", name: "Patiya", bnName: "পটিয়া" },
  { district: "Chattogram", name: "Hathazari", bnName: "হাটহাজারী" },
  { district: "Chattogram", name: "Raozan", bnName: "রাউজান" },
  { district: "Chattogram", name: "Rangunia", bnName: "রাঙ্গুনিয়া" },
  { district: "Chattogram", name: "Boalkhali", bnName: "বোয়ালখালী" },
  { district: "Chattogram", name: "Anwara", bnName: "আনোয়ারা" },
  { district: "Chattogram", name: "Chandanaish", bnName: "চন্দনাইশ" },
  { district: "Chattogram", name: "Satkania", bnName: "সাতকানিয়া" },
  { district: "Chattogram", name: "Lohagara", bnName: "লোহাগাড়া" },
  { district: "Chattogram", name: "Banshkhali", bnName: "বাঁশখালী" },
  { district: "Chattogram", name: "Sandwip", bnName: "সন্দ্বীপ" },
  { district: "Chattogram", name: "Karnaphuli", bnName: "কর্ণফুলী" },

  // --- COX'S BAZAR ---
  { district: "Cox's Bazar", name: "Cox's Bazar Sadar", bnName: "কক্সবাজার সদর" },
  { district: "Cox's Bazar", name: "Chakaria", bnName: "চকোরিয়া" },
  { district: "Cox's Bazar", name: "Maheshkhali", bnName: "মহেশখালী" },
  { district: "Cox's Bazar", name: "Teknaf", bnName: "টেকনাফ" },
  { district: "Cox's Bazar", name: "Ukhia", bnName: "উখিয়া" },
  { district: "Cox's Bazar", name: "Ramu", bnName: "রামু" },
  { district: "Cox's Bazar", name: "Kutubdia", bnName: "কুতুবদিয়া" },
  { district: "Cox's Bazar", name: "Pekua", bnName: "পেকুয়া" },
  { district: "Cox's Bazar", name: "Eidgaon", bnName: "ঈদগাঁও" },

  // --- CUMILLA ---
  { district: "Cumilla", name: "Cumilla Adarsha Sadar", bnName: "কুমিল্লা আদর্শ সদর" },
  { district: "Cumilla", name: "Cumilla Sadar South", bnName: "কুমিল্লা সদর দক্ষিণ" },
  { district: "Cumilla", name: "Laksam", bnName: "লাকসাম" },
  { district: "Cumilla", name: "Debidwar", bnName: "দেবিদ্বার" },
  { district: "Cumilla", name: "Daudkandi", bnName: "দাউদকান্দি" },
  { district: "Cumilla", name: "Chandina", bnName: "চান্দিনা" },
  { district: "Cumilla", name: "Muradnagar", bnName: "মুরাদনগর" },
  { district: "Cumilla", name: "Barura", bnName: "বরুড়া" },
  { district: "Cumilla", name: "Burichang", bnName: "বুড়িচং" },
  { district: "Cumilla", name: "Brahmanpara", bnName: "ব্রাহ্মণপাড়া" },
  { district: "Cumilla", name: "Homna", bnName: "হোমনা" },
  { district: "Cumilla", name: "Meghna", bnName: "মেঘনা" },
  { district: "Cumilla", name: "Monohargonj", bnName: "মনোহরগঞ্জ" },
  { district: "Cumilla", name: "Titas", bnName: "তিতাস" },
  { district: "Cumilla", name: "Chauddagram", bnName: "চৌদ্দগ্রাম" },
  { district: "Cumilla", name: "Nangalkot", bnName: "নাঙ্গলকোট" },
  { district: "Cumilla", name: "Lalmai", bnName: "লালমাই" },

  // --- FENI ---
  { district: "Feni", name: "Feni Sadar", bnName: "ফেনী সদর" },
  { district: "Feni", name: "Daganbhuiyan", bnName: "দাগনভূঞা" },
  { district: "Feni", name: "Chhagalnaiya", bnName: "ছাগলনাইয়া" },
  { district: "Feni", name: "Sonagazi", bnName: "সোনাগাজী" },
  { district: "Feni", name: "Parshuram", bnName: "পরশুরাম" },
  { district: "Feni", name: "Fulgazi", bnName: "ফুলগাজী" },

  // --- BRAHMANBARIA ---
  { district: "Brahmanbaria", name: "Brahmanbaria Sadar", bnName: "ব্রাহ্মণবাড়িয়া সদর" },
  { district: "Brahmanbaria", name: "Kasba", bnName: "কসবা" },
  { district: "Brahmanbaria", name: "Nabinagar", bnName: "নবীনগর" },
  { district: "Brahmanbaria", name: "Sarail", bnName: "সরাইল" },
  { district: "Brahmanbaria", name: "Ashuganj", bnName: "আশুগঞ্জ" },
  { district: "Brahmanbaria", name: "Akhaura", bnName: "আখাউড়া" },
  { district: "Brahmanbaria", name: "Nasirnagar", bnName: "নাসিরনগর" },
  { district: "Brahmanbaria", name: "Bancharampur", bnName: "বাঞ্ছারামপুর" },
  { district: "Brahmanbaria", name: "Bijoynagar", bnName: "বিজয়নগর" },

  // --- CHANDPUR ---
  { district: "Chandpur", name: "Chandpur Sadar", bnName: "চাঁদপুর সদর" },
  { district: "Chandpur", name: "Hajiganj", bnName: "হাজীগঞ্জ" },
  { district: "Chandpur", name: "Matlab North", bnName: "মতলব উত্তর" },
  { district: "Chandpur", name: "Matlab South", bnName: "মতলব দক্ষিণ" },
  { district: "Chandpur", name: "Shahrasti", bnName: "শাহরাস্তি" },
  { district: "Chandpur", name: "Faridganj", bnName: "ফরিদগঞ্জ" },
  { district: "Chandpur", name: "Haimchar", bnName: "হাইমচর" },
  { district: "Chandpur", name: "Kachua", bnName: "কচুয়া" },

  // --- NOAKHALI ---
  { district: "Noakhali", name: "Noakhali Sadar", bnName: "নোয়াখালী সদর" },
  { district: "Noakhali", name: "Begumganj", bnName: "বেগমগঞ্জ" },
  { district: "Noakhali", name: "Chatkhil", bnName: "চাটখিল" },
  { district: "Noakhali", name: "Companyganj", bnName: "কোম্পানীগঞ্জ" },
  { district: "Noakhali", name: "Senbagh", bnName: "সেনবাগ" },
  { district: "Noakhali", name: "Hatiya", bnName: "হাতিয়া" },
  { district: "Noakhali", name: "Kabirhat", bnName: "কবিরহাট" },
  { district: "Noakhali", name: "Sonaimuri", bnName: "সোনাইমুড়ী" },
  { district: "Noakhali", name: "Subarnachar", bnName: "সুবর্ণচর" },

  // --- LAKSHMIPUR ---
  { district: "Lakshmipur", name: "Lakshmipur Sadar", bnName: "লক্ষ্মীপুর সদর" },
  { district: "Lakshmipur", name: "Raipur", bnName: "রায়পুর" },
  { district: "Lakshmipur", name: "Ramganj", bnName: "রামগঞ্জ" },
  { district: "Lakshmipur", name: "Ramgati", bnName: "রামগতি" },
  { district: "Lakshmipur", name: "Kamalnagar", bnName: "কমলনগর" },

  // --- HILL TRACTS (Khagrachhari, Rangamati, Bandarban) ---
  { district: "Khagrachhari", name: "Khagrachhari Sadar", bnName: "খাগড়াছড়ি সদর" },
  { district: "Khagrachhari", name: "Dighinala", bnName: "দীঘিনালা" },
  { district: "Khagrachhari", name: "Panchhari", bnName: "পানছড়ি" },
  { district: "Khagrachhari", name: "Mahalchhari", bnName: "মহলছড়ি" },
  { district: "Khagrachhari", name: "Matiranga", bnName: "মাটিরাঙ্গা" },
  { district: "Khagrachhari", name: "Manikchhari", bnName: "মানিকছড়ি" },
  { district: "Khagrachhari", name: "Ramgarh", bnName: "রামগড়" },
  { district: "Khagrachhari", name: "Guimara", bnName: "গুইমারা" },

  { district: "Rangamati", name: "Rangamati Sadar", bnName: "রাঙ্গামাটি সদর" },
  { district: "Rangamati", name: "Kaptai", bnName: "কাপ্তাই" },
  { district: "Rangamati", name: "Baghaichhari", bnName: "বাঘাইছড়ি" },
  { district: "Rangamati", name: "Barkal", bnName: "বরকল" },
  { district: "Rangamati", name: "Langadu", bnName: "লংগদু" },
  { district: "Rangamati", name: "Rajasthali", bnName: "রাজস্থলী" },
  { district: "Rangamati", name: "Belaichhari", bnName: "বিলাইছড়ি" },
  { district: "Rangamati", name: "Juraichhari", bnName: "জুরাইছড়ি" },
  { district: "Rangamati", name: "Naniarchar", bnName: "নানিয়ারচর" },

  { district: "Bandarban", name: "Bandarban Sadar", bnName: "বান্দরবান সদর" },
  { district: "Bandarban", name: "Ruma", bnName: "রুমা" },
  { district: "Bandarban", name: "Thanchi", bnName: "থানচি" },
  { district: "Bandarban", name: "Lama", bnName: "লামা" },
  { district: "Bandarban", name: "Alikadam", bnName: "আলীকদম" },
  { district: "Bandarban", name: "Rowangchhari", bnName: "রোয়াংছড়ি" },
  { district: "Bandarban", name: "Naikhongchhari", bnName: "নাইক্ষ্যংছড়ি" },

  // --- RAJSHAHI DISTRICT ---
  { district: "Rajshahi", name: "Rajshahi Sadar / Boalia", bnName: "রাজশাহী সদর / বোয়ালিয়া" },
  { district: "Rajshahi", name: "Motihar", bnName: "মতিহার" },
  { district: "Rajshahi", name: "Rajpara", bnName: "রাজপাড়া" },
  { district: "Rajshahi", name: "Shah Mokdum", bnName: "শাহ মখদুম" },
  { district: "Rajshahi", name: "Paba", bnName: "পবা" },
  { district: "Rajshahi", name: "Godagari", bnName: "গোদাগাড়ী" },
  { district: "Rajshahi", name: "Tanore", bnName: "তানোর" },
  { district: "Rajshahi", name: "Mohanpur", bnName: "মোহনপুর" },
  { district: "Rajshahi", name: "Bagmara", bnName: "বাগমারা" },
  { district: "Rajshahi", name: "Durgapur", bnName: "দুর্গাপুর" },
  { district: "Rajshahi", name: "Puthia", bnName: "পুঠিয়া" },
  { district: "Rajshahi", name: "Charghat", bnName: "চারঘাট" },
  { district: "Rajshahi", name: "Bagha", bnName: "বাঘা" },

  // --- BOGURA ---
  { district: "Bogura", name: "Bogura Sadar", bnName: "বগুড়া সদর" },
  { district: "Bogura", name: "Shajahanpur", bnName: "শাজাহানপুর" },
  { district: "Bogura", name: "Sherpur", bnName: "শেরপুর" },
  { district: "Bogura", name: "Dhunat", bnName: "ধুনট" },
  { district: "Bogura", name: "Sariakandi", bnName: "সারিয়াকান্দি" },
  { district: "Bogura", name: "Gabtali", bnName: "গাবতলী" },
  { district: "Bogura", name: "Kahaloo", bnName: "কাহালু" },
  { district: "Bogura", name: "Nandigram", bnName: "নন্দীগ্রাম" },
  { district: "Bogura", name: "Dupchanchia", bnName: "দুপচাঁচিয়া" },
  { district: "Bogura", name: "Adamdighi", bnName: "আদমদিঘী" },
  { district: "Bogura", name: "Shibganj", bnName: "শিবগঞ্জ" },
  { district: "Bogura", name: "Sonatola", bnName: "সোনাতলা" },

  // --- PABNA ---
  { district: "Pabna", name: "Pabna Sadar", bnName: "পাবনা সদর" },
  { district: "Pabna", name: "Ishwardi", bnName: "ঈশ্বরদী" },
  { district: "Pabna", name: "Atgharia", bnName: "আটঘরিয়া" },
  { district: "Pabna", name: "Chatmohar", bnName: "চাটমোহর" },
  { district: "Pabna", name: "Bhangura", bnName: "ভাঙ্গুড়া" },
  { district: "Pabna", name: "Faridpur", bnName: "ফরিদপুর" },
  { district: "Pabna", name: "Bera", bnName: "বেড়া" },
  { district: "Pabna", name: "Santhia", bnName: "সাঁথিয়া" },
  { district: "Pabna", name: "Sujanagar", bnName: "সুজানগর" },

  // --- SIRAJGANJ ---
  { district: "Sirajganj", name: "Sirajganj Sadar", bnName: "সিরাজগঞ্জ সদর" },
  { district: "Sirajganj", name: "Shahjadpur", bnName: "শাহজাদপুর" },
  { district: "Sirajganj", name: "Ullapara", bnName: "উল্লাপাড়া" },
  { district: "Sirajganj", name: "Belkuchi", bnName: "বেলকুচি" },
  { district: "Sirajganj", name: "Kazipur", bnName: "কাজীপুর" },
  { district: "Sirajganj", name: "Kamarkhanda", bnName: "কামারখন্দ" },
  { district: "Sirajganj", name: "Tarash", bnName: "তাড়াশ" },
  { district: "Sirajganj", name: "Raiganj", bnName: "রায়গঞ্জ" },
  { district: "Sirajganj", name: "Chauhali", bnName: "চৌহালী" },

  // --- NAOGAON ---
  { district: "Naogaon", name: "Naogaon Sadar", bnName: "নওগাঁ সদর" },
  { district: "Naogaon", name: "Manda", bnName: "মান্দা" },
  { district: "Naogaon", name: "Patnitala", bnName: "পত্নীতলা" },
  { district: "Naogaon", name: "Dhamoirhat", bnName: "ধামইরহাট" },
  { district: "Naogaon", name: "Mohadevpur", bnName: "মহাদেবপুর" },
  { district: "Naogaon", name: "Badalgachhi", bnName: "বদলগাছী" },
  { district: "Naogaon", name: "Raninagar", bnName: "রাণীনগর" },
  { district: "Naogaon", name: "Atrai", bnName: "আত্রাই" },
  { district: "Naogaon", name: "Niamatpur", bnName: "নিয়ামতপুর" },
  { district: "Naogaon", name: "Porsha", bnName: "পোরশা" },
  { district: "Naogaon", name: "Sapahar", bnName: "সাপাহার" },

  // --- NATORE ---
  { district: "Natore", name: "Natore Sadar", bnName: "নাটোর সদর" },
  { district: "Natore", name: "Singra", bnName: "সিংড়া" },
  { district: "Natore", name: "Baraigram", bnName: "বড়াইগ্রাম" },
  { district: "Natore", name: "Bagatipara", bnName: "বাগাতিপাড়া" },
  { district: "Natore", name: "Lalpur", bnName: "লালপুর" },
  { district: "Natore", name: "Gurudaspur", bnName: "গুরুদাসপুর" },
  { district: "Natore", name: "Naldanga", bnName: "নলডাঙ্গা" },

  // --- CHAPAINAWABGANJ ---
  { district: "Chapainawabganj", name: "Chapainawabganj Sadar", bnName: "চাঁপাইনবাবগঞ্জ সদর" },
  { district: "Chapainawabganj", name: "Shibganj", bnName: "শিবগঞ্জ" },
  { district: "Chapainawabganj", name: "Gomostapur", bnName: "গোমস্তাপুর" },
  { district: "Chapainawabganj", name: "Nachole", bnName: "নাচোল" },
  { district: "Chapainawabganj", name: "Bholahat", bnName: "ভোলাহাট" },

  // --- JOYPURHAT ---
  { district: "Joypurhat", name: "Joypurhat Sadar", bnName: "জয়পুরহাট সদর" },
  { district: "Joypurhat", name: "Panchbibi", bnName: "পাঁচবিবি" },
  { district: "Joypurhat", name: "Khetlal", bnName: "ক্ষেতলাল" },
  { district: "Joypurhat", name: "Akkelpur", bnName: "আক্কেলপুর" },
  { district: "Joypurhat", name: "Kalai", bnName: "কালাই" },

  // --- KHULNA DISTRICT ---
  { district: "Khulna", name: "Khulna Sadar / Kotwali", bnName: "খুলনা সদর / কোতোয়ালী" },
  { district: "Khulna", name: "Sonadanga", bnName: "সোনাডাঙ্গা" },
  { district: "Khulna", name: "Khalishpur", bnName: "খালিশপুর" },
  { district: "Khulna", name: "Daulatpur", bnName: "দৌলতপুর" },
  { district: "Khulna", name: "Khan Jahan Ali", bnName: "খান জাহান আলী" },
  { district: "Khulna", name: "Dumuria", bnName: "ডুমুরিয়া" },
  { district: "Khulna", name: "Batiaghata", bnName: "বটিয়াঘাটা" },
  { district: "Khulna", name: "Dacope", bnName: "দাকোপ" },
  { district: "Khulna", name: "Phultala", bnName: "ফুলতলা" },
  { district: "Khulna", name: "Dighalia", bnName: "দিঘলিয়া" },
  { district: "Khulna", name: "Koyra", bnName: "কয়রা" },
  { district: "Khulna", name: "Paikgachha", bnName: "পাইকগাছা" },
  { district: "Khulna", name: "Rupsha", bnName: "রূপসা" },
  { district: "Khulna", name: "Terokhada", bnName: "তেরখাদা" },

  // --- JASHORE ---
  { district: "Jashore", name: "Jashore Sadar", bnName: "যশোর সদর" },
  { district: "Jashore", name: "Jhikargachha", bnName: "ঝিকরগাছা" },
  { district: "Jashore", name: "Sharsha (Benapole)", bnName: "শার্শা (বেনাপোল)" },
  { district: "Jashore", name: "Manirampur", bnName: "মণিরামপুর" },
  { district: "Jashore", name: "Keshabpur", bnName: "কেশবপুর" },
  { district: "Jashore", name: "Chaugachha", bnName: "চৌগাছা" },
  { district: "Jashore", name: "Bagherpara", bnName: "বাঘারপাড়া" },
  { district: "Jashore", name: "Abhaynagar", bnName: "অভয়নগর" },

  // --- KUSHTIA ---
  { district: "Kushtia", name: "Kushtia Sadar", bnName: "কুষ্টিয়া সদর" },
  { district: "Kushtia", name: "Kumarkhali", bnName: "কুমারখালী" },
  { district: "Kushtia", name: "Bheramara", bnName: "ভেড়ামারা" },
  { district: "Kushtia", name: "Mirpur", bnName: "মিরপুর" },
  { district: "Kushtia", name: "Daulatpur", bnName: "দৌলতপুর" },
  { district: "Kushtia", name: "Khoksa", bnName: "খোকসা" },

  // --- JHENAIDAH ---
  { district: "Jhenaidah", name: "Jhenaidah Sadar", bnName: "ঝিনাইদহ সদর" },
  { district: "Jhenaidah", name: "Kaliganj", bnName: "কালীগঞ্জ" },
  { district: "Jhenaidah", name: "Kotchandpur", bnName: "কোটচাঁদপুর" },
  { district: "Jhenaidah", name: "Maheshpur", bnName: "মহেশপুর" },
  { district: "Jhenaidah", name: "Shailkupa", bnName: "শৈলকুপা" },
  { district: "Jhenaidah", name: "Harinakundu", bnName: "হরিণাকুণ্ডু" },

  // --- SATKHIRA ---
  { district: "Satkhira", name: "Satkhira Sadar", bnName: "সাতক্ষীরা সদর" },
  { district: "Satkhira", name: "Kalaroa", bnName: "কলারোয়া" },
  { district: "Satkhira", name: "Tala", bnName: "তালা" },
  { district: "Satkhira", name: "Debhata", bnName: "দেবহাটা" },
  { district: "Satkhira", name: "Kaliganj", bnName: "কালীগঞ্জ" },
  { district: "Satkhira", name: "Assasuni", bnName: "আশাশুনি" },
  { district: "Satkhira", name: "Shyamnagar", bnName: "শ্যামনগর" },

  // --- BAGERHAT ---
  { district: "Bagerhat", name: "Bagerhat Sadar", bnName: "বাগেরহাট সদর" },
  { district: "Bagerhat", name: "Mongla", bnName: "মোংলা" },
  { district: "Bagerhat", name: "Rampal", bnName: "রামপাল" },
  { district: "Bagerhat", name: "Morrelganj", bnName: "মোড়েলগঞ্জ" },
  { district: "Bagerhat", name: "Fakirhat", bnName: "ফকিরহাট" },
  { district: "Bagerhat", name: "Kachua", bnName: "কচুয়া" },
  { district: "Bagerhat", name: "Chitalmari", bnName: "চিতলমারী" },
  { district: "Bagerhat", name: "Mollahat", bnName: "মোল্লাহাট" },
  { district: "Bagerhat", name: "Sarankhola", bnName: "শরণখোলা" },

  // --- CHUADANGA, MEHERPUR, MAGURA, NARAIL ---
  { district: "Chuadanga", name: "Chuadanga Sadar", bnName: "চুয়াডাঙ্গা সদর" },
  { district: "Chuadanga", name: "Alamdanga", bnName: "আলমডাঙ্গা" },
  { district: "Chuadanga", name: "Damurhuda", bnName: "দামুড়হুদা" },
  { district: "Chuadanga", name: "Jibannagar", bnName: "জীবননগর" },

  { district: "Meherpur", name: "Meherpur Sadar", bnName: "মেহেরপুর সদর" },
  { district: "Meherpur", name: "Gangni", bnName: "গাংনী" },
  { district: "Meherpur", name: "Mujibnagar", bnName: "মুজিবনগর" },

  { district: "Magura", name: "Magura Sadar", bnName: "মাগুরা সদর" },
  { district: "Magura", name: "Sreepur", bnName: "শ্রীপুর" },
  { district: "Magura", name: "Mohammadpur", bnName: "মোহাম্মদপুর" },
  { district: "Magura", name: "Shalikha", bnName: "শালিখা" },

  { district: "Narail", name: "Narail Sadar", bnName: "নড়াইল সদর" },
  { district: "Narail", name: "Lohagara", bnName: "লোহাগড়া" },
  { district: "Narail", name: "Kalia", bnName: "কালিয়া" },

  // --- BARISHAL DISTRICT ---
  { district: "Barishal", name: "Barishal Sadar / Kotwali", bnName: "বরিশাল সদর / কোতোয়ালী" },
  { district: "Barishal", name: "Bakerganj", bnName: "বাকেরগঞ্জ" },
  { district: "Barishal", name: "Babuganj", bnName: "বাবুগঞ্জ" },
  { district: "Barishal", name: "Wazirpur", bnName: "উজিরপুর" },
  { district: "Barishal", name: "Banaripara", bnName: "বানারীপাড়া" },
  { district: "Barishal", name: "Gournadi", bnName: "গৌরনদী" },
  { district: "Barishal", name: "Agailjhara", bnName: "আগৈলঝাড়া" },
  { district: "Barishal", name: "Mehendiganj", bnName: "মেহেন্দিগঞ্জ" },
  { district: "Barishal", name: "Muladi", bnName: "মুলাদী" },
  { district: "Barishal", name: "Hizla", bnName: "হিজলা" },

  // --- BHOLA ---
  { district: "Bhola", name: "Bhola Sadar", bnName: "ভোলা সদর" },
  { district: "Bhola", name: "Daulatkhan", bnName: "দৌলতখান" },
  { district: "Bhola", name: "Borhanuddin", bnName: "বোরহানউদ্দিন" },
  { district: "Bhola", name: "Tazumuddin", bnName: "তজুমদ্দিন" },
  { district: "Bhola", name: "Lalmohan", bnName: "লালমোহন" },
  { district: "Bhola", name: "Char Fasson", bnName: "চরফ্যাশন" },
  { district: "Bhola", name: "Monpura", bnName: "মনপুরা" },

  // --- PATUAKHALI ---
  { district: "Patuakhali", name: "Patuakhali Sadar", bnName: "পটুয়াখালী সদর" },
  { district: "Patuakhali", name: "Bauphal", bnName: "বাউফল" },
  { district: "Patuakhali", name: "Galachipa", bnName: "গলাচিপা" },
  { district: "Patuakhali", name: "Dashmina", bnName: "দশমিনা" },
  { district: "Patuakhali", name: "Kalapara (Kuakata)", bnName: "কলাপাড়া (কুয়াকাটা)" },
  { district: "Patuakhali", name: "Mirzaganj", bnName: "মির্জাগঞ্জ" },
  { district: "Patuakhali", name: "Dumki", bnName: "দুমকি" },
  { district: "Patuakhali", name: "Rangabali", bnName: "রাঙ্গাবালী" },

  // --- PIROJPUR, BARGUNA, JHALOKATHI ---
  { district: "Pirojpur", name: "Pirojpur Sadar", bnName: "পিরোজপুর সদর" },
  { district: "Pirojpur", name: "Nazirpur", bnName: "নাজিরপুর" },
  { district: "Pirojpur", name: "Mathbaria", bnName: "মঠবাড়িয়া" },
  { district: "Pirojpur", name: "Bhandaria", bnName: "ভাণ্ডারিয়া" },
  { district: "Pirojpur", name: "Kawkhali", bnName: "কাউখালী" },
  { district: "Pirojpur", name: "Nesarabad (Swarupkathi)", bnName: "নেছারাবাদ (স্বরূপকাঠি)" },
  { district: "Pirojpur", name: "Indurkani", bnName: "ইন্দুরকানী" },

  { district: "Barguna", name: "Barguna Sadar", bnName: "বরগুনা সদর" },
  { district: "Barguna", name: "Amtali", bnName: "আমতলী" },
  { district: "Barguna", name: "Patharghata", bnName: "পাথরঘাটা" },
  { district: "Barguna", name: "Betagi", bnName: "বেতাগী" },
  { district: "Barguna", name: "Bamna", bnName: "বামনা" },
  { district: "Barguna", name: "Taltali", bnName: "তালতলী" },

  { district: "Jhalokathi", name: "Jhalokathi Sadar", bnName: "ঝালকাঠি সদর" },
  { district: "Jhalokathi", name: "Kathalia", bnName: "কাঠালিয়া" },
  { district: "Jhalokathi", name: "Nalchity", bnName: "নলছিটি" },
  { district: "Jhalokathi", name: "Rajapur", bnName: "রাজাপুর" },

  // --- SYLHET DISTRICT ---
  { district: "Sylhet", name: "Sylhet Sadar / Kotwali", bnName: "সিলেট সদর / কোতোয়ালী" },
  { district: "Sylhet", name: "South Surma", bnName: "দক্ষিণ সুরমা" },
  { district: "Sylhet", name: "Beanibazar", bnName: "বিয়ানীবাজার" },
  { district: "Sylhet", name: "Golapganj", bnName: "গোলাপগঞ্জ" },
  { district: "Sylhet", name: "Zakiganj", bnName: "জকিগঞ্জ" },
  { district: "Sylhet", name: "Kanaighat", bnName: "কানাইঘাট" },
  { district: "Sylhet", name: "Jaintiapur", bnName: "জৈন্তাপুর" },
  { district: "Sylhet", name: "Gowainghat", bnName: "গোয়াইনঘাট" },
  { district: "Sylhet", name: "Companiganj", bnName: "কোম্পানীগঞ্জ" },
  { district: "Sylhet", name: "Balaganj", bnName: "বালাগঞ্জ" },
  { district: "Sylhet", name: "Biswanath", bnName: "বিশ্বনাথ" },
  { district: "Sylhet", name: "Fenchuganj", bnName: "ফেঞ্চুগঞ্জ" },
  { district: "Sylhet", name: "Osmani Nagar", bnName: "ওসমানী নগর" },

  // --- MOULVIBAZAR ---
  { district: "Moulvibazar", name: "Moulvibazar Sadar", bnName: "মৌলভীবাজার সদর" },
  { district: "Moulvibazar", name: "Sreemangal", bnName: "শ্রীমঙ্গল" },
  { district: "Moulvibazar", name: "Kamalganj", bnName: "কমলগঞ্জ" },
  { district: "Moulvibazar", name: "Kulaura", bnName: "কুলাউড়া" },
  { district: "Moulvibazar", name: "Rajnagar", bnName: "রাজনগর" },
  { district: "Moulvibazar", name: "Barlekha", bnName: "বড়লেখা" },
  { district: "Moulvibazar", name: "Juri", bnName: "জুড়ী" },

  // --- HABIGANJ ---
  { district: "Habiganj", name: "Habiganj Sadar", bnName: "হবিগঞ্জ সদর" },
  { district: "Habiganj", name: "Madhabpur", bnName: "মাধবপুর" },
  { district: "Habiganj", name: "Chunarughat", bnName: "চুনারুঘাট" },
  { district: "Habiganj", name: "Bahubal", bnName: "বাহুবল" },
  { district: "Habiganj", name: "Nabiganj", bnName: "নবীগঞ্জ" },
  { district: "Habiganj", name: "Baniachong", bnName: "বানিয়াচং" },
  { district: "Habiganj", name: "Ajmiriganj", bnName: "আজমিরীগঞ্জ" },
  { district: "Habiganj", name: "Lakhai", bnName: "লাখাই" },
  { district: "Habiganj", name: "Sayestaganj", bnName: "শায়েস্তাগঞ্জ" },

  // --- SUNAMGANJ ---
  { district: "Sunamganj", name: "Sunamganj Sadar", bnName: "সুনামগঞ্জ সদর" },
  { district: "Sunamganj", name: "Chhatak", bnName: "ছাতক" },
  { district: "Sunamganj", name: "Jagannathpur", bnName: "জগন্নাথপুর" },
  { district: "Sunamganj", name: "Derai", bnName: "দিরাই" },
  { district: "Sunamganj", name: "Tahirpur", bnName: "তাহিরপুর" },
  { district: "Sunamganj", name: "Dharampasha", bnName: "ধর্মপাশা" },
  { district: "Sunamganj", name: "Jamalganj", bnName: "জামালগঞ্জ" },
  { district: "Sunamganj", name: "Shantiganj", bnName: "শান্তিগঞ্জ" },
  { district: "Sunamganj", name: "Dowarabazar", bnName: "দোয়ারাবাজার" },
  { district: "Sunamganj", name: "Sullah", bnName: "শাল্লা" },
  { district: "Sunamganj", name: "Biswamvarpur", bnName: "বিশ্বম্ভরপুর" },
  { district: "Sunamganj", name: "Madhyanagar", bnName: "মধ্যনগর" },

  // --- RANGPUR DISTRICT ---
  { district: "Rangpur", name: "Rangpur Sadar / Kotwali", bnName: "রংপুর সদর / কোতোয়ালী" },
  { district: "Rangpur", name: "Pirganj", bnName: "পীরগঞ্জ" },
  { district: "Rangpur", name: "Mithapukur", bnName: "মিঠাপুকুর" },
  { district: "Rangpur", name: "Badarganj", bnName: "বদরগঞ্জ" },
  { district: "Rangpur", name: "Pirgachha", bnName: "পীরগাছা" },
  { district: "Rangpur", name: "Kaunia", bnName: "কাউনিয়া" },
  { district: "Rangpur", name: "Gangachhara", bnName: "গংগাচড়া" },
  { district: "Rangpur", name: "Taraganj", bnName: "তারাগঞ্জ" },

  // --- DINAJPUR ---
  { district: "Dinajpur", name: "Dinajpur Sadar", bnName: "দিনাজপুর সদর" },
  { district: "Dinajpur", name: "Birganj", bnName: "বীরগঞ্জ" },
  { district: "Dinajpur", name: "Kaharole", bnName: "কাহারোল" },
  { district: "Dinajpur", name: "Khansama", bnName: "খানসামা" },
  { district: "Dinajpur", name: "Chirirbandar", bnName: "চিরিরবন্দর" },
  { district: "Dinajpur", name: "Parbatipur", bnName: "পার্বতীপুর" },
  { district: "Dinajpur", name: "Phulbari", bnName: "ফুলবাড়ী" },
  { district: "Dinajpur", name: "Nawabganj", bnName: "নবাবগঞ্জ" },
  { district: "Dinajpur", name: "Birampur", bnName: "বিরামপুর" },
  { district: "Dinajpur", name: "Hakimpur (Hili)", bnName: "হাকিমপুর (হিলি)" },
  { district: "Dinajpur", name: "Ghoraghat", bnName: "ঘোড়াঘাট" },
  { district: "Dinajpur", name: "Bochaganj", bnName: "বোচাগঞ্জ" },
  { district: "Dinajpur", name: "Biral", bnName: "বিরল" },

  // --- GAIBANDHA, KURIGRAM, LALMONIRHAT, NILPHAMARI, PANCHAGARH, THAKURGAON ---
  { district: "Gaibandha", name: "Gaibandha Sadar", bnName: "গাইবান্ধা সদর" },
  { district: "Gaibandha", name: "Gobindaganj", bnName: "গোবিন্দগঞ্জ" },
  { district: "Gaibandha", name: "Sundarganj", bnName: "সুন্দরগঞ্জ" },
  { district: "Gaibandha", name: "Palashbari", bnName: "পলাশবাড়ী" },
  { district: "Gaibandha", name: "Sadullapur", bnName: "সাদুল্লাপুর" },
  { district: "Gaibandha", name: "Saghata", bnName: "সাঘাটা" },
  { district: "Gaibandha", name: "Phulchhari", bnName: "ফুলছড়ি" },

  { district: "Kurigram", name: "Kurigram Sadar", bnName: "কুড়িগ্রাম সদর" },
  { district: "Kurigram", name: "Nageshwari", bnName: "নাগেশ্বরী" },
  { district: "Kurigram", name: "Bhurungamari", bnName: "ভুরুঙ্গামারী" },
  { district: "Kurigram", name: "Ulipur", bnName: "উলিপুর" },
  { district: "Kurigram", name: "Chilmari", bnName: "চিলমারী" },
  { district: "Kurigram", name: "Rajarhat", bnName: "রাজারহাট" },
  { district: "Kurigram", name: "Rowmari", bnName: "রৌমারী" },
  { district: "Kurigram", name: "Char Rajibpur", bnName: "চর রাজিবপুর" },
  { district: "Kurigram", name: "Phulbari", bnName: "ফুলবাড়ী" },

  { district: "Lalmonirhat", name: "Lalmonirhat Sadar", bnName: "লালমনিরহাট সদর" },
  { district: "Lalmonirhat", name: "Patgram (Burimari)", bnName: "পাটগ্রাম (বুড়িমারী)" },
  { district: "Lalmonirhat", name: "Hatibandha", bnName: "হাতীবান্ধা" },
  { district: "Lalmonirhat", name: "Kaliganj", bnName: "কালীগঞ্জ" },
  { district: "Lalmonirhat", name: "Aditmari", bnName: "আদিতমারী" },

  { district: "Nilphamari", name: "Nilphamari Sadar", bnName: "নীলফামারী সদর" },
  { district: "Nilphamari", name: "Saidpur", bnName: "সৈয়দপুর" },
  { district: "Nilphamari", name: "Domar", bnName: "ডোমার" },
  { district: "Nilphamari", name: "Dimla", bnName: "ডিমলা" },
  { district: "Nilphamari", name: "Jaldhaka", bnName: "জলঢাকা" },
  { district: "Nilphamari", name: "Kishoreganj", bnName: "কিশোরগঞ্জ" },

  { district: "Panchagarh", name: "Panchagarh Sadar", bnName: "পঞ্চগড় সদর" },
  { district: "Panchagarh", name: "Tetulia (Banglabandha)", bnName: "তেঁতুলিয়া (বাংলাবান্ধা)" },
  { district: "Panchagarh", name: "Boda", bnName: "বোদা" },
  { district: "Panchagarh", name: "Debiganj", bnName: "দেবীগঞ্জ" },
  { district: "Panchagarh", name: "Atwari", bnName: "আটোয়ারী" },

  { district: "Thakurgaon", name: "Thakurgaon Sadar", bnName: "ঠাকুরগাঁও সদর" },
  { district: "Thakurgaon", name: "Pirganj", bnName: "পীরগঞ্জ" },
  { district: "Thakurgaon", name: "Ranisankail", bnName: "রাণীশংকৈল" },
  { district: "Thakurgaon", name: "Baliadangi", bnName: "বালিয়াডাঙ্গী" },
  { district: "Thakurgaon", name: "Haripur", bnName: "হরিপুর" },

  // --- MYMENSINGH DISTRICT ---
  { district: "Mymensingh", name: "Mymensingh Sadar / Kotwali", bnName: "ময়মনসিংহ সদর / কোতোয়ালী" },
  { district: "Mymensingh", name: "Trishal", bnName: "ত্রিশাল" },
  { district: "Mymensingh", name: "Bhaluka", bnName: "ভালুকা" },
  { district: "Mymensingh", name: "Muktagachha", bnName: "মুক্তাগাছা" },
  { district: "Mymensingh", name: "Phulpur", bnName: "ফুলপুর" },
  { district: "Mymensingh", name: "Haluaghat", bnName: "হালুয়াঘাট" },
  { district: "Mymensingh", name: "Gafargaon", bnName: "গফরগাঁও" },
  { district: "Mymensingh", name: "Ishwarganj", bnName: "ঈশ্বরগঞ্জ" },
  { district: "Mymensingh", name: "Nandail", bnName: "নান্দাইল" },
  { district: "Mymensingh", name: "Gouripur", bnName: "গৌরীপুর" },
  { district: "Mymensingh", name: "Dhobaura", bnName: "ধোবাউড়া" },
  { district: "Mymensingh", name: "Tara Khanda", bnName: "তারাকান্দা" },

  // --- JAMALPUR, NETROKONA, SHERPUR ---
  { district: "Jamalpur", name: "Jamalpur Sadar", bnName: "জামালপুর সদর" },
  { district: "Jamalpur", name: "Sarishabari", bnName: "সরিষাবাড়ী" },
  { district: "Jamalpur", name: "Melandaha", bnName: "মেলান্দহ" },
  { district: "Jamalpur", name: "Islampur", bnName: "ইসলামপুর" },
  { district: "Jamalpur", name: "Dewanganj", bnName: "দেওয়ানগঞ্জ" },
  { district: "Jamalpur", name: "Madarganj", bnName: "মাদারগঞ্জ" },
  { district: "Jamalpur", name: "Bakshiganj", bnName: "বকশীগঞ্জ" },

  { district: "Netrokona", name: "Netrokona Sadar", bnName: "নেত্রকোণা সদর" },
  { district: "Netrokona", name: "Kendua", bnName: "কেন্দুয়া" },
  { district: "Netrokona", name: "Durgapur", bnName: "দুর্গাপুর" },
  { district: "Netrokona", name: "Mohanganj", bnName: "মোহনগঞ্জ" },
  { district: "Netrokona", name: "Kalmakanda", bnName: "কলমাকান্দা" },
  { district: "Netrokona", name: "Barhatta", bnName: "বারহাট্টা" },
  { district: "Netrokona", name: "Atpara", bnName: "আটপাড়া" },
  { district: "Netrokona", name: "Madan", bnName: "মদন" },
  { district: "Netrokona", name: "Khaliajuri", bnName: "খালিয়াজুরী" },
  { district: "Netrokona", name: "Purbadhala", bnName: "পূর্বধলা" },

  { district: "Sherpur", name: "Sherpur Sadar", bnName: "শেরপুর সদর" },
  { district: "Sherpur", name: "Nalitabari", bnName: "নালিতাবাড়ী" },
  { district: "Sherpur", name: "Nakla", bnName: "নকলা" },
  { district: "Sherpur", name: "Sreebardi", bnName: "শ্রীবরদী" },
  { district: "Sherpur", name: "Jhenaigati", bnName: "ঝিনাইগাতী" },
];

/**
 * Seeding Function: Inserts or updates Bangladesh Divisions, 64 Districts,
 * Upazilas/Areas, and Global Shipping Settings into MongoDB.
 */
export const seedBangladeshLocations = async (forceOverwrite = false) => {
  try {
    const districtCount = await DistrictModel.countDocuments();
    if (districtCount > 0 && !forceOverwrite) {
      console.log(`ℹ️ Bangladesh Geo Locations already seeded (${districtCount} districts found). Skipping.`);
      return { success: true, message: "Already seeded", districtCount };
    }

    console.log("🌱 Starting fast bulk Bangladesh Geo Data seeding...");

    // 1. Seed Global Shipping Settings
    await ShippingSettingModel.findOneAndUpdate(
      {},
      {
        $setOnInsert: {
          insideDhakaDeliveryCharge: 70,
          outsideDhakaDeliveryCharge: 130,
          insideDhakaExpressCharge: 120,
          outsideDhakaExpressCharge: 180,
          freeDeliveryThreshold: 0,
          estimatedDaysInsideDhaka: "1-2 Days",
          estimatedDaysOutsideDhaka: "2-4 Days",
          notes: "Cash on delivery available all across Bangladesh.",
        },
      },
      { upsert: true, new: true }
    );

    // 2. Clear old data if forceOverwrite
    if (forceOverwrite) {
      await Promise.all([
        DivisionModel.deleteMany({}),
        DistrictModel.deleteMany({}),
        UpazilaModel.deleteMany({}),
      ]);
    }

    // 3. Insert Divisions
    const insertedDivisions = await DivisionModel.insertMany(
      BD_DIVISIONS_DATA.map((d) => ({ ...d, isActive: true })),
      { ordered: false }
    );

    const divisionIdMap = new Map<string, any>();
    insertedDivisions.forEach((d) => {
      divisionIdMap.set(d.name, d._id);
    });

    // 4. Insert Districts
    const districtsToInsert = BD_DISTRICTS_DATA.map((dist) => ({
      name: dist.name,
      bnName: dist.bnName,
      division: dist.division,
      divisionRef: divisionIdMap.get(dist.division),
      deliveryCharge: dist.deliveryCharge,
      expressDeliveryCharge: dist.expressDeliveryCharge,
      estimatedDeliveryDays: dist.estimatedDeliveryDays,
      isInsideDhaka: dist.isInsideDhaka,
      isActive: true,
    }));

    const insertedDistricts = await DistrictModel.insertMany(districtsToInsert, {
      ordered: false,
    });

    const districtIdMap = new Map<string, any>();
    insertedDistricts.forEach((d) => {
      districtIdMap.set(d.name, d._id);
    });

    // 5. Insert Upazilas (deduplicate by name and district)
    const uniqueUpazilasMap = new Map<string, any>();
    for (const upz of BD_UPAZILAS_DATA) {
      const key = `${upz.name.trim()}__${upz.district.trim()}`.toLowerCase();
      if (!uniqueUpazilasMap.has(key)) {
        uniqueUpazilasMap.set(key, {
          name: upz.name.trim(),
          bnName: upz.bnName.trim(),
          district: upz.district.trim(),
          districtRef: districtIdMap.get(upz.district),
          isActive: true,
        });
      }
    }

    const upazilasToInsert = Array.from(uniqueUpazilasMap.values());
    await UpazilaModel.insertMany(upazilasToInsert, { ordered: false });

    console.log(`🎉 Fast seeding completed: ${insertedDivisions.length} divisions, ${insertedDistricts.length} districts, ${upazilasToInsert.length} upazilas.`);

    return {
      success: true,
      divisions: insertedDivisions.length,
      districts: insertedDistricts.length,
      upazilas: upazilasToInsert.length,
    };
  } catch (error: any) {
    console.error("❌ Failed to seed Bangladesh locations:", error);
    throw new Error(error.message || "Failed to seed Bangladesh locations");
  }
};
