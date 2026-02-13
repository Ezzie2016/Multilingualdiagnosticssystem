import { DiagnosticResult, Language } from '../App';

// Medical knowledge base with multilingual support
const medicalKnowledgeBase = {
  en: {
    keywords: {
      headache: { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      fever: { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      cough: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      'sore throat': { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      nausea: { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      dizziness: { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      'chest pain': { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      'back pain': { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      fatigue: { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      'shortness of breath': { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['severe', 'mild', 'moderate', 'intense', 'sharp', 'dull', 'persistent'],
    durationWords: ['days', 'hours', 'weeks', 'months', 'minutes']
  },
  es: {
    keywords: {
      'dolor de cabeza': { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      fiebre: { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      tos: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      'dolor de garganta': { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      náuseas: { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      mareos: { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      'dolor en el pecho': { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      'dolor de espalda': { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      fatiga: { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      'falta de aire': { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['severo', 'leve', 'moderado', 'intenso', 'agudo', 'sordo', 'persistente'],
    durationWords: ['días', 'horas', 'semanas', 'meses', 'minutos']
  },
  fr: {
    keywords: {
      'mal de tête': { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      fièvre: { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      toux: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      'mal de gorge': { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      nausées: { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      étourdissements: { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      'douleur thoracique': { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      'douleur au dos': { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      fatigue: { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      essoufflement: { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['sévère', 'léger', 'modéré', 'intense', 'aigu', 'sourd', 'persistant'],
    durationWords: ['jours', 'heures', 'semaines', 'mois', 'minutes']
  },
  de: {
    keywords: {
      kopfschmerzen: { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      fieber: { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      husten: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      halsschmerzen: { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      übelkeit: { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      schwindel: { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      brustschmerzen: { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      rückenschmerzen: { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      müdigkeit: { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      atemnot: { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['schwer', 'leicht', 'mäßig', 'intensiv', 'scharf', 'dumpf', 'anhaltend'],
    durationWords: ['tage', 'stunden', 'wochen', 'monate', 'minuten']
  },
  zh: {
    keywords: {
      头痛: { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      发烧: { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      咳嗽: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      喉咙痛: { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      恶心: { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      头晕: { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      胸痛: { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      背痛: { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      疲劳: { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      呼吸困难: { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['严重', '轻微', '中度', '剧烈', '尖锐', '钝', '持续'],
    durationWords: ['天', '小时', '周', '月', '分钟']
  },
  ar: {
    keywords: {
      صداع: { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      حمى: { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      سعال: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      'التهاب الحلق': { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      غثيان: { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      دوار: { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      'ألم الصدر': { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      'ألم الظهر': { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      تعب: { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      'ضيق التنفس': { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['شديد', 'خفيف', 'متوسط', 'حاد', 'ثاقب', 'باهت', 'مستمر'],
    durationWords: ['أيام', 'ساعات', 'أسابيع', 'شهور', 'دقائق']
  },
  ha: {
    keywords: {
      'ciwon kai': { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      zazzabi: { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      tari: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      'ciwon makogwaro': { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      'tashin zuciya': { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      suma: { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      'ciwon kirji': { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      'ciwon baya': { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      gajiya: { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      'ƙyuwar numfashi': { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['mai tsanani', 'mai sauƙi', 'matsakaici', 'mai ƙarfi', 'mai kaifi', 'mai laushi', 'mai dawwama'],
    durationWords: ['kwanaki', 'awanni', 'makonni', 'watanni', 'mintuna']
  },
  yo: {
    keywords: {
      'irori ori': { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      iba: { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      ikọ: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      'ọfun ọfun': { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      ikorira: { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      'irora ori': { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      'irora ọkan': { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      'irora ẹhin': { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      aarẹ: { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      'ẹmi kukuru': { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['nla', 'kekere', 'aarin', 'lagbara', 'didasilẹ', 'rirọ', 'titẹsiwaju'],
    durationWords: ['ọjọ', 'wakati', 'ọsẹ', 'oṣu', 'iṣẹju']
  },
  ig: {
    keywords: {
      'isi ọwụwa': { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      'ahụ ọkụ': { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      ụkwara: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      'akpịrị mgbu': { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      ọgbụgbọ: { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      'isi ọwụwa_dizziness': { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      'mgbu obi': { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      'mgbu azụ': { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      'ike gwụrụ': { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      'iku ume siri ike': { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['siri ike', 'dị nta', 'ọkara', 'dị ike', 'dị nkọ', 'dị nro', 'na-adịgide'],
    durationWords: ['ụbọchị', 'awa', 'izu', 'ọnwa', 'nkeji']
  },
  pcm: {
    keywords: {
      headache: { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      fever: { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      cough: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      'sore throat': { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      'belle pain': { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      'head dey turn': { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      'chest pain': { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      'back pain': { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      'body weak': { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      'no fit breathe': { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['serious', 'small', 'so-so', 'plenty', 'sharp', 'dull', 'no dey stop'],
    durationWords: ['days', 'hours', 'weeks', 'months', 'minutes']
  },
  ff: {
    keywords: {
      'hoore yejjitee': { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      jummirde: { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      tuttungol: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      'yejji kunnde': { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      ɓeynugol: { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      'hoore yejjitaare': { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      'yejji heccere': { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      'yejji layɗo': { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      jaaynde: { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      'ɗaɓɓugol wareeji': { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['sukaaɓe', 'famɗi', 'hakkunde', 'mawndu', 'ceertuɗo', 'tolnol', 'woppingo'],
    durationWords: ['ñalnguuji', 'njamndi', 'yontere', 'lewru', 'hojomaaji']
  },
  kr: {
    keywords: {
      'kashikro wuye': { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      kurowa: { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      toshi: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      'kelǝ wuye': { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      'kǝra kursi': { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      'kashikro tawar': { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      'kashikro wuye_chest': { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      'ngalaro wuye': { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      'kursi naro': { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      'numfashi kambe': { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['fal', 'kambe', 'kǝlǝ', 'ngadaro', 'kashikro', 'tolnol', 'ngamnaro'],
    durationWords: ['kashiri', 'kursi', 'kashikri', 'shǝtta', 'minjiti']
  },
  ibb: {
    keywords: {
      'mkpọ ukọ': { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      'ukut asịsọñọ': { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      ntufọk: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      'mkpọ ufọk': { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      nkpọ: { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      'ukọ ndiwụt': { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      'mkpọ obot': { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      'mkpọ ayara': { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      'ikọt ukut': { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      'nkeme emi': { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['nkpọ', 'kamit', 'kiet', 'mkpa', 'nkpọ', 'tolnol', 'emi ndiwọp'],
    durationWords: ['usọñ', 'awa', 'ikọt', 'usen', 'minjit']
  },
  tiv: {
    keywords: {
      'u ter ken': { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      ikumen: { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      'u tuen': { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      'u ter gwaghwa': { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      ikumen_nausea: { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      ikyume: { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      'u ter gbaange': { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      'u ter uveren': { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      'kwaghyan sha': { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      'mngerem kambe': { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['sha', 'nahan', 'kwaghyan', 'ken', 'sha', 'tolnol', 'ga'],
    durationWords: ['ahar', 'utar', 'ikwahar', 'mbaor', 'ikyume']
  },
  ijc: {
    keywords: {
      'tẹin ụrụ': { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      'ọwọrọ gbanị': { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      kọfị: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      'tẹin kpọn': { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      ẹkpụ: { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      'ụrụ tẹin': { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      'tẹin ọkaka': { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      'tẹin bẹlẹ': { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      'biri tẹin': { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      'yemi kambe': { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['bara', 'bịrị', 'kẹ', 'pụọ', 'bara', 'tolnol', 'tari'],
    durationWords: ['ụbọ', 'awa', 'ikọt', 'ọnwa', 'minjit']
  },
  bin: {
    keywords: {
      'ukpọn ukọ': { symptom: 'headache', bodyPart: 'head', conditions: ['migraine', 'tension_headache', 'sinusitis'] },
      ọwọrọ: { symptom: 'fever', bodyPart: 'body', conditions: ['flu', 'infection', 'covid19'] },
      uku: { symptom: 'cough', bodyPart: 'chest', conditions: ['bronchitis', 'flu', 'covid19'] },
      'ukpọn ẹhọn': { symptom: 'sore throat', bodyPart: 'throat', conditions: ['pharyngitis', 'flu', 'strep_throat'] },
      ẹkpụ: { symptom: 'nausea', bodyPart: 'stomach', conditions: ['gastroenteritis', 'food_poisoning', 'migraine'] },
      'ukpọn koko': { symptom: 'dizziness', bodyPart: 'head', conditions: ['vertigo', 'low_blood_pressure', 'dehydration'] },
      'ukpọn okhuo': { symptom: 'chest pain', bodyPart: 'chest', conditions: ['angina', 'anxiety', 'gastritis'] },
      'ukpọn bẹlẹ': { symptom: 'back pain', bodyPart: 'back', conditions: ['muscle_strain', 'herniated_disc', 'sciatica'] },
      'egbe khian': { symptom: 'fatigue', bodyPart: 'body', conditions: ['anemia', 'chronic_fatigue', 'depression'] },
      'emi kambe': { symptom: 'shortness of breath', bodyPart: 'chest', conditions: ['asthma', 'anxiety', 'heart_condition'] }
    },
    severityWords: ['guẹguẹ', 'kamit', 'kpọlọ', 'nkpọ', 'bara', 'tolnol', 'ọ koko'],
    durationWords: ['ẹvbọ', 'ọwọ', 'ikọt', 'usen', 'minjit']
  }
};

// Condition descriptions and recommendations in multiple languages
const conditionData: Record<string, Record<Language, { name: string; description: string; recommendations: string[] }>> = {
  migraine: {
    en: {
      name: 'Migraine',
      description: 'A neurological condition characterized by intense, debilitating headaches often accompanied by nausea and sensitivity to light.',
      recommendations: ['Rest in a quiet, dark room', 'Apply cold compress to forehead', 'Stay hydrated', 'Consider over-the-counter pain relievers', 'Consult a neurologist if symptoms persist']
    },
    es: {
      name: 'Migraña',
      description: 'Una condición neurológica caracterizada por dolores de cabeza intensos y debilitantes, a menudo acompañados de náuseas y sensibilidad a la luz.',
      recommendations: ['Descansar en una habitación tranquila y oscura', 'Aplicar compresa fría en la frente', 'Mantenerse hidratado', 'Considerar analgésicos de venta libre', 'Consultar a un neurólogo si los síntomas persisten']
    },
    fr: {
      name: 'Migraine',
      description: 'Une condition neurologique caractérisée par des maux de tête intenses et débilitants, souvent accompagnés de nausées et de sensibilité à la lumière.',
      recommendations: ['Se reposer dans une pièce calme et sombre', 'Appliquer une compresse froide sur le front', 'Rester hydraté', 'Envisager des analgésiques en vente libre', 'Consulter un neurologue si les symptômes persistent']
    },
    de: {
      name: 'Migräne',
      description: 'Eine neurologische Erkrankung, die durch intensive, schwächende Kopfschmerzen gekennzeichnet ist, oft begleitet von Übelkeit und Lichtempfindlichkeit.',
      recommendations: ['In einem ruhigen, dunklen Raum ausruhen', 'Kalte Kompresse auf die Stirn legen', 'Ausreichend Flüssigkeit zu sich nehmen', 'Rezeptfreie Schmerzmittel in Betracht ziehen', 'Neurologen konsultieren, wenn Symptome anhalten']
    },
    zh: {
      name: '偏头痛',
      description: '一种神经系统疾病，特征是剧烈、使人虚弱的头痛，常伴有恶心和对光敏感。',
      recommendations: ['在安静、黑暗的房间休息', '在额头敷冷敷', '保持水分', '考虑使用非处方止痛药', '如果症状持续，请咨询神经科医生']
    },
    ar: {
      name: 'الصداع النصفي',
      description: 'حالة عصبية تتميز بصداع شديد ومنهك غالباً ما يكون مصحوباً بالغثيان والحساسية للضوء.',
      recommendations: ['الراحة في غرفة هادئة ومظلمة', 'وضع كمادة باردة على الجبهة', 'البقاء رطباً', 'التفكير في مسكنات الألم المتاحة دون وصفة طبية', 'استشارة طبيب أعصاب إذا استمرت الأعراض']
    },
    ha: {
      name: 'Ciwon Kai (Migraine)',
      description: 'Matsalar jiki mai haɗuwa da ciwon kai mai tsanani da rashin ƙarfi, galibi yana zuwa tare da tashin zuciya da rashin jurewa haske.',
      recommendations: ['Huta a ɗaki mai nutsuwa da duhu', 'Sanya sanyi a goshi', 'Shan ruwa mai yawa', 'Yi la\'akari da magungunan kashe zafi da ba a buƙatar takardar likita', 'Tuntubi ƙwararren likitan jijiyoyi idan alamun suka ci gaba']
    },
    yo: {
      name: 'Irori Ori (Migraine)',
      description: 'Ipo ara ti o ni ibatan pelu irori ori nla ati alailagbara, nigbagbogbo o ma wa pelu ikorira ati ifarabalẹ si imọlẹ.',
      recommendations: ['Sinmi ni yara ti o dake ti o si ṣokunkun', 'Fi tutu si iwaju', 'Ma mu omi pupọ', 'Ronu lori awọn oogun irora ti o wa laisi iwe iṣẹ', 'Kan si onimọ ara ti o mọ nipa ẹsọ ti awọn ami-aisan ba tẹsiwaju']
    },
    ig: {
      name: 'Isi Ọwụwa (Migraine)',
      description: 'Ọnọdụ akwara nke nwere isi ọwụwa siri ike na-eme ka onye nwee ike ọgwụgwọ, na-abịakarị ya na ọgbụgbọ na ịdị nro nke ìhè.',
      recommendations: ['Zuru ike n\'ọnụ ụlọ dị jụụ na gbara ọchịchịrị', 'Tinye ihe oyi n\'egedege ihu', 'Ṅụọ mmiri ọtụtụ', 'Tụlee ọgwụ mgbu ị nwere ike ịzụta na-enweghị akwụkwọ dọkịta', 'Kpọtụrụ ọkachamara mgbakọ akwara ma ọ bụrụ na ihe mgbaàmà gara n\'ihu']
    },
    pcm: {
      name: 'Serious Headache (Migraine)',
      description: 'Na nerve problem wey dey cause serious headache wey dey make person weak, e dey always come with belle pain and no fit see light.',
      recommendations: ['Rest for quiet dark room', 'Put cold thing for your forehead', 'Drink plenty water', 'You fit buy pain killer for chemist', 'Go see nerve doctor if am no stop']
    },
    ff: {
      name: 'Hoore Yejjitee (Migraine)',
      description: 'Caggal neɗɗo huutoraade hoore yejjitee mawnde e jaaynde, heewde fof yaltata e ɓeynugol e goonga e ceerol.',
      recommendations: ['Yaaru e suudu tolnol e dumol', 'Sirtin tolol e hoore', 'Yaru njamndi yaajɗe', 'Tiiɗno keɓɓindir kuutorɗe yejji alaa takarle jiyaaɗo', 'Jokkondir jiyaaɗo neɗɗo so siiftooji jokkondiri']
    },
    kr: {
      name: 'Kashikro Wuye (Migraine)',
      description: 'Shǝddǝ wuye ngamnaro kashikro kǝnǝ fal ye kursi kambe, galibi kǝlǝ tare ye kǝra ye numfashi kambe.',
      recommendations: ['Kursi ngam ɗaki tolnol ye duhu', 'Sanya sanyi kashikro', 'Shan ruwa fal', 'Tǝla magungunan kashe wuye', 'Shawar likita ngam so wuye ngamnaro']
    },
    ibb: {
      name: 'Mkpọ Ukọ (Migraine)',
      description: 'Unwana mkpọ ukọ emi nkpọ ye ikọt ukut kambe, emi ndiwọp kiet ye nkpọ ye nkeme.',
      recommendations: ['Yak ọdọhọ ke ufọk emi tolnol ye duhu', 'Sanya tolol ke ukọ', 'Yụñụ mmọñ yaajɗe', 'Tọp ọkaọgwụ mkpọ', 'Yọọ dọkịta unwana so mkpọ ndiwọp']
    },
    tiv: {
      name: 'U Ter Ken (Migraine)',
      description: 'U kwaghyan nahan u ter ken sha ye ikumen kambe, ga kpaa ye ikumen ye numfashi kambe ceerol.',
      recommendations: ['Yar ọdọhọ tolnol ye duhu', 'Sanya tolol ken', 'Yam mmọñ yaajɗe', 'Tọp magungunan u ter', 'Doo dọkịta so u ter ndiwọp']
    },
    ijc: {
      name: 'Tẹin Ụrụ (Migraine)',
      description: 'Sẹbiri tẹin ụrụ bara ye biri kambe, tari kiet ye ẹkpụ ye yemi kambe imọlẹ.',
      recommendations: ['Kiri ọdọ tolnol ye duhu', 'Tụọ tolol ụrụ', 'Yụñụ sọ yaajɗe', 'Kọmị ọgwụ tẹin', 'Yẹ dọkita so tẹin bara']
    },
    bin: {
      name: 'Ukpọn Ukọ (Migraine)',
      description: 'Imẹ ukpọn ukọ guẹguẹ ye egbe kambe, ọ koko kiet ye ẹkpụ ye emi kambe imọlẹ.',
      recommendations: ['Yak ọdọ tolnol ye duhu', 'Tụọ tolol ukọ', 'Yụñụ mmọñ fal', 'Kọmị ọgwụ ukpọn', 'Yọọ dọkita so ukpọn guẹguẹ']
    }
  },
  flu: {
    en: {
      name: 'Influenza (Flu)',
      description: 'A contagious respiratory illness caused by influenza viruses, characterized by fever, cough, sore throat, and body aches.',
      recommendations: ['Get plenty of rest', 'Drink lots of fluids', 'Take fever-reducing medications', 'Avoid contact with others', 'Seek medical attention if symptoms worsen']
    },
    es: {
      name: 'Gripe',
      description: 'Una enfermedad respiratoria contagiosa causada por virus de la gripe, caracterizada por fiebre, tos, dolor de garganta y dolores corporales.',
      recommendations: ['Descansar mucho', 'Beber muchos líquidos', 'Tomar medicamentos para reducir la fiebre', 'Evitar el contacto con otras personas', 'Buscar atención médica si los síntomas empeoran']
    },
    fr: {
      name: 'Grippe',
      description: 'Une maladie respiratoire contagieuse causée par des virus grippaux, caractérisée par de la fièvre, de la toux, un mal de gorge et des courbatures.',
      recommendations: ['Beaucoup de repos', 'Boire beaucoup de liquides', 'Prendre des médicaments pour réduire la fièvre', 'Éviter le contact avec les autres', 'Consulter un médecin si les symptômes s\'aggravent']
    },
    de: {
      name: 'Grippe',
      description: 'Eine ansteckende Atemwegserkrankung, die durch Influenzaviren verursacht wird und durch Fieber, Husten, Halsschmerzen und Gliederschmerzen gekennzeichnet ist.',
      recommendations: ['Viel Ruhe', 'Viel trinken', 'Fiebersenkende Medikamente einnehmen', 'Kontakt mit anderen vermeiden', 'Arzt aufsuchen, wenn sich die Symptome verschlimmern']
    },
    zh: {
      name: '流感',
      description: '由流感病毒引起的传染性呼吸道疾病，特征是发烧、咳嗽、喉咙痛和身体疼痛。',
      recommendations: ['充分休息', '多喝水', '服用退烧药', '避免与他人接触', '如果症状恶化，请就医']
    },
    ar: {
      name: 'الأنفلونزا',
      description: 'مرض تنفسي معدي ناتج عن فيروسات الأنفلونزا، يتميز بالحمى والسعال والتهاب الحلق وآلام الجسم.',
      recommendations: ['الحصول على قسط كاف من الراحة', 'شرب الكثير من السوائل', 'تناول أدوية خافضة للحرارة', 'تجنب الاتصال بالآخرين', 'طلب العناية الطبية إذا ساءت الأعراض']
    },
    ha: {
      name: 'Mura (Flu)',
      description: 'Cutar numfashi mai yaduwa ta hanyar ƙwayoyin mura, mai alaƙa da zazzabi, tari, ciwon makogwaro da ciwon jiki.',
      recommendations: ['Huta sosai', 'Shan ruwa da yawa', 'Shan magungunan rage zazzabi', 'Nisantar da sauran mutane', 'Neman kulawar likita idan alamun sun kara muni']
    },
    yo: {
      name: 'Arun Iba (Flu)',
      description: 'Arun ẹmi-ẹmi ti o ni aarun-irin ti o wa lati ọdọ kokoro aarun iba, ti o ni ibatan pelu iba, ikọ, ọfun ọfun ati irora ara.',
      recommendations: ['Sinmi daadaa', 'Mu omi pupọ', 'Mu oogun idinku iba', 'Yago fun ibakan pẹlu awọn ẹlomiran', 'Wa abojuto ilera ti awọn ami-aisan ba buruju']
    },
    ig: {
      name: 'Ọrịa Flu',
      description: 'Ọrịa iku ume na-efe efe nke sitere na nje virus flu, nke nwere ahụ ọkụ, ụkwara, akpịrị mgbu na mgbu ahụ.',
      recommendations: ['Zuru ike nke ọma', 'Ṅụọ mmiri ọtụtụ', 'Rie ọgwụ na-ebelata ahụ ọkụ', 'Zeere ịkpọtụrụ ndị ọzọ', 'Chọọ nlekọta ahụike ma ọ bụrụ na ihe mgbaàmà ka njọ']
    },
    pcm: {
      name: 'Flu',
      description: 'Sickness wey dey catch person through air, e come from flu virus, e go give you fever, cough, sore throat and body pain.',
      recommendations: ['Rest well well', 'Drink plenty water', 'Take medicine wey go bring down fever', 'No go near other people', 'Go hospital if e dey worse']
    },
    ff: {
      name: 'Mura (Flu)',
      description: 'Fedde wareeji feewnde e ɗemngal virus mura, huutoraade jummirde, tuttungol, yejji kunnde e yejji gorko.',
      recommendations: ['Yaaru heewde', 'Yaru njamndi yaajɗe', 'ñaamu kuutorɗe jummirde', 'Neldee neɗɗo woɓɓe', 'Yiylo jiyaaɗo so siiftooji ɓeydii']
    },
    kr: {
      name: 'Mura (Flu)',
      description: 'Wuye numfashi feewnde ngamnaro virus mura, kǝlǝ kurowa, toshi, kelǝ wuye ye wuye kǝla.',
      recommendations: ['Kursi heewde', 'Shan ruwa yaajɗe', 'Yam magungunan kurowa', 'Neldee neɗɗo', 'Shawar likita so wuye ɓeydii']
    },
    ibb: {
      name: 'Mura (Flu)',
      description: 'Unwana emi feewnde virus mura, kǝlǝ ukut asịsọñọ, ntufọk, mkpọ ufọk ye mkpọ ubọk.',
      recommendations: ['Yak heewde', 'Yụñụ mmọñ yaajɗe', 'Yam ọkaọgwụ ukut', 'Kpan neɗɗo', 'Yọọ dọkita so mkpọ ɓeydii']
    },
    tiv: {
      name: 'Mura (Flu)',
      description: 'U kwaghyan numfashi feewnde virus mura, kǝlǝ ikumen, u tuen, u ter gwaghwa ye u ter.',
      recommendations: ['Yar heewde', 'Yam mmọñ fal', 'Yam magungunan ikumen', 'Neldee neɗɗo', 'Doo dọkita so u ter ��eydii']
    },
    ijc: {
      name: 'Mura (Flu)',
      description: 'Sẹbiri yemi feewnde virus mura, kǝlǝ ọwọrọ gbanị, kọfị, tẹin kpọn ye tẹin biri.',
      recommendations: ['Kiri heewde', 'Yụñụ sọ fal', 'Yam ọgwụ ọwọrọ', 'Kpan bụọ', 'Yẹ dọkita so tẹin bara']
    },
    bin: {
      name: 'Mura (Flu)',
      description: 'Imẹ emi feewnde virus mura, kǝlǝ ọwọrọ, uku, ukpọn ẹhọn ye ukpọn egbe.',
      recommendations: ['Yak heewde', 'Yụñụ mmọñ fal', 'Yam ọgwụ ọwọrọ', 'Kpan bụọ', 'Yọọ dọkita so ukpọn guẹguẹ']
    }
  },
  gastroenteritis: {
    en: {
      name: 'Gastroenteritis',
      description: 'Inflammation of the digestive tract causing nausea, vomiting, diarrhea, and abdominal pain.',
      recommendations: ['Stay hydrated with clear fluids', 'Eat bland foods (BRAT diet)', 'Avoid dairy and fatty foods', 'Rest adequately', 'Seek medical help if dehydration occurs']
    },
    es: {
      name: 'Gastroenteritis',
      description: 'Inflamación del tracto digestivo que causa náuseas, vómitos, diarrea y dolor abdominal.',
      recommendations: ['Mantenerse hidratado con líquidos claros', 'Comer alimentos suaves (dieta BRAT)', 'Evitar lácteos y alimentos grasos', 'Descansar adecuadamente', 'Buscar ayuda médica si ocurre deshidratación']
    },
    fr: {
      name: 'Gastro-entérite',
      description: 'Inflammation du tractus digestif provoquant des nausées, des vomissements, de la diarrhée et des douleurs abdominales.',
      recommendations: ['Rester hydraté avec des liquides clairs', 'Manger des aliments fades (régime BRAT)', 'Éviter les produits laitiers et les aliments gras', 'Se reposer correctement', 'Consulter un médecin en cas de déshydratation']
    },
    de: {
      name: 'Gastroenteritis',
      description: 'Entzündung des Verdauungstrakts, die Übelkeit, Erbrechen, Durchfall und Bauchschmerzen verursacht.',
      recommendations: ['Mit klaren Flüssigkeiten hydratisiert bleiben', 'Milde Lebensmittel essen (BRAT-Diät)', 'Milchprodukte und fetthaltige Lebensmittel vermeiden', 'Ausreichend Ruhe', 'Medizinische Hilfe bei Dehydrierung suchen']
    },
    zh: {
      name: '胃肠炎',
      description: '消化道炎症，引起恶心、呕吐、腹泻和腹痛。',
      recommendations: ['用清澈的液体保持水分', '吃清淡的食物（BRAT饮食）', '避免乳制品和油腻食物', '充分休息', '如发生脱水，请就医']
    },
    ar: {
      name: 'التهاب المعدة والأمعاء',
      description: 'التهاب الجهاز الهضمي يسبب الغثيان والقيء والإسهال وآلام البطن.',
      recommendations: ['البقاء رطباً بالسوائل الصافية', 'تناول الأطعمة الخفيفة (حمية BRAT)', 'تجنب منتجات الألبان والأطعمة الدهنية', 'الراحة الكافية', 'طلب المساعدة الطبية في حالة حدوث الجفاف']
    },
    ha: {
      name: 'Cutar Ciki',
      description: 'Kumburi na tsarin narkewar abinci wanda ke haifar da tashin zuciya, amai, gudawa da ciwon ciki.',
      recommendations: ['Shan ruwa mai tsabta', 'Cin abinci mai sauƙi', 'Guje wa kiwo da abinci mai mai', 'Huta sosai', 'Neman taimako na likita idan an bushe']
    },
    yo: {
      name: 'Arun Inú',
      description: 'Wiwu inu ti o fa ikorira, ibí, igbẹ ati irora inú.',
      recommendations: ['Mu omi ti o mọ', 'Je ounjẹ alainipon', 'Yago fun wàrà ati ounjẹ ọra', 'Sinmi daadaa', 'Wa iranlọwọ ilera ti gbigbẹ ba ṣẹlẹ']
    },
    ig: {
      name: 'Ọrịa Afọ',
      description: 'Mbufụt nke usoro mgbaze nri na-akpata ọgbụgbọ, ọgbụgbọ, afọ ọsịsa na mgbu afọ.',
      recommendations: ['Ṅụọ mmiri dị ọcha', 'Rie nri dị nro', 'Zere mmiri ara ehi na nri abụba', 'Zuru ike nke ọma', 'Chọọ enyemaka ahụike ma ọ bụrụ na ị kpọrọ nkụ']
    },
    pcm: {
      name: 'Belly Problem',
      description: 'Swelling for belle wey dey cause vomit, purging and belle pain.',
      recommendations: ['Drink clean water', 'Chop soft food', 'No take milk and oily food', 'Rest well', 'Go hospital if water loss dey much']
    },
    ff: {
      name: 'Fedde Rewrude',
      description: 'Ɓeynugol huutoraade ɓeynugol, tooɗde, jaɓɓugol e yejji rewrude.',
      recommendations: ['Yaru njamndi cellal', 'ñaamu ñaamdu tolnol', 'Neldee kosam e ñaamu ɓuuɓri', 'Yaaru heewde', 'Yiylo jiyaaɗo so njamndi wari']
    },
    kr: {
      name: 'Wuye Kǝra',
      description: 'Kumburi na wuye kǝra wanda kǝlǝ nkpọ, amai, gudawa ye wuye kǝra.',
      recommendations: ['Shan ruwa cellal', 'Cin abinci tolnol', 'Guje kosam ye abinci ɓuuɓri', 'Kursi', 'Shawar likita so bushe']
    },
    ibb: {
      name: 'Unwana Ikọt',
      description: 'Mbufụt ikọt emi nkpọ, nkpọ, gudawa ye mkpọ ikọt.',
      recommendations: ['Yụñụ mmọñ cellal', 'Yam nri tolnol', 'Kpan kosam ye nri ɓuuɓri', 'Yak', 'Yọọ dọkita so bushe']
    },
    tiv: {
      name: 'U Kwaghyan Ikọt',
      description: 'Kumburi ikọt emi ikumen, ikumen, gudawa ye u ter ikọt.',
      recommendations: ['Yam mmọñ cellal', 'Yam nri tolnol', 'Kpan kosam ye nri ɓuuɓri', 'Yar', 'Doo dọkita so bushe']
    },
    ijc: {
      name: 'Sẹbiri Bẹlẹ',
      description: 'Mbufụt bẹlẹ emi ẹkpụ, ẹkpụ, gudawa ye tẹin bẹlẹ.',
      recommendations: ['Yụñụ sọ cellal', 'Yam ọka tolnol', 'Kpan kosam ye ọka ɓuuɓri', 'Kiri', 'Yẹ dọkita so bushe']
    },
    bin: {
      name: 'Imẹ Ikọt',
      description: 'Mbufụt ikọt emi ẹkpụ, ẹkpụ, gudawa ye ukpọn ikọt.',
      recommendations: ['Yụñụ mmọñ cellal', 'Yam nri tolnol', 'Kpan kosam ye nri ɓuuɓri', 'Yak', 'Yọọ dọkita so bushe']
    }
  },
  vertigo: {
    en: {
      name: 'Vertigo',
      description: 'A sensation of spinning or dizziness, often caused by inner ear problems or vestibular issues.',
      recommendations: ['Sit or lie down immediately', 'Avoid sudden head movements', 'Stay hydrated', 'Perform balance exercises', 'Consult an ENT specialist']
    },
    es: {
      name: 'Vértigo',
      description: 'Una sensación de giro o mareo, a menudo causada por problemas del oído interno o problemas vestibulares.',
      recommendations: ['Sentarse o acostarse inmediatamente', 'Evitar movimientos bruscos de la cabeza', 'Mantenerse hidratado', 'Realizar ejercicios de equilibrio', 'Consultar a un especialista en otorrinolaringología']
    },
    fr: {
      name: 'Vertige',
      description: 'Une sensation de rotation ou d\'étourdissement, souvent causée par des problèmes de l\'oreille interne ou des problèmes vestibulaires.',
      recommendations: ['S\'asseoir ou s\'allonger immédiatement', 'Éviter les mouvements brusques de la tête', 'Rester hydraté', 'Effectuer des exercices d\'équilibre', 'Consulter un spécialiste ORL']
    },
    de: {
      name: 'Schwindel',
      description: 'Ein Gefühl von Drehen oder Benommenheit, oft verursacht durch Innenohrprobleme oder vestibuläre Probleme.',
      recommendations: ['Sofort hinsetzen oder hinlegen', 'Plötzliche Kopfbewegungen vermeiden', 'Ausreichend Flüssigkeit zu sich nehmen', 'Gleichgewichtsübungen durchführen', 'HNO-Facharzt konsultieren']
    },
    zh: {
      name: '眩晕',
      description: '一种旋转或头晕的感觉，通常由内耳问题或前庭问题引起。',
      recommendations: ['立即坐下或躺下', '避免突然的头部运动', '保持水分', '进行平衡练习', '咨询耳鼻喉专科医生']
    },
    ar: {
      name: 'الدوار',
      description: 'إحساس بالدوران أو الدوخة، غالباً ما يكون ناتجاً عن مشاكل في الأذن الداخلية أو مشاكل دهليزية.',
      recommendations: ['الجلوس أو الاستلقاء فوراً', 'تجنب حركات الرأس المفاجئة', 'البقاء رطباً', 'إجراء تمارين التوازن', 'استشارة أخصائي الأنف والأذن والحنجرة']
    },
    ha: {
      name: 'Suma',
      description: 'Jin kamar abin da ke juyawa ko suma, sau da yawa yana faruwa sakamakon matsalolin kunne na ciki ko matsalolin ma\'auni.',
      recommendations: ['Zauna ko kwanta nan da nan', 'Guje wa motsin kai kwatsam', 'Shan ruwa sosai', 'Yi motsa jiki na daidaitawa', 'Tuntubi likitan kunne, hanci da makogwaro']
    },
    yo: {
      name: 'Irora Ori',
      description: 'Imọ lẹ ti yiyipo tabi irora ori, nigbagbogbo lati awọn iṣoro eti inu tabi awọn ọran itọsọna.',
      recommendations: ['Joko tabi dubulẹ lẹsẹkẹsẹ', 'Yago fun gbigbe ori lojiji', 'Mu omi pupọ', 'Ṣe awọn idaraya iwọntunwọnsi', 'Kan si alamọja ENT']
    },
    ig: {
      name: 'Isi Ọwụwa',
      description: 'Mmetụta nke ịgbagharị ma ọ bụ isi ọwụwa, nke na-abụkarị n\'ihi nsogbu ntị ime ma ọ bụ nsogbu vestibular.',
      recommendations: ['Nọdụ ala ma ọ bụ dinaa ozugbo', 'Zere mmegharị isi na mberede', 'Ṅụọ mmiri nke ọma', 'Mee mmega ahụ nguzozi', 'Kpọtụrụ ọkachamara ENT']
    },
    pcm: {
      name: 'Head Dey Turn',
      description: 'When your head dey turn like say something dey spin, e fit come from inner ear problem or balance problem.',
      recommendations: ['Sit down or lie down sharp sharp', 'No move your head suddenly', 'Drink water well', 'Do balance exercise', 'Go see ENT doctor']
    },
    ff: {
      name: 'Hoore Yejjitaare',
      description: 'Jaabawol yaltugol e hoore yejjitaare, heewde fof ñalnde e caggal noppito coklit e caggal ittooje ma\'auni.',
      recommendations: ['Jokkondiru e dow e yaaru', 'Neldee motsin hoore kwatsam', 'Yaru njamndi', 'Waɗ motsa ma\'auni', 'Jokkondir likita noppito, lenyol e makogwaro']
    },
    kr: {
      name: 'Kashikro Tawar',
      description: 'Jin kamar yaltugol ko kashikro tawar, sau kǝlǝ noppito kunne ciki ko ma\'auni.',
      recommendations: ['Zauna ko kwanta', 'Guje motsin kashikro kwatsam', 'Shan ruwa', 'Yi motsa ma\'auni', 'Shawar likita noppito']
    },
    ibb: {
      name: 'Ukọ Ndiwụt',
      description: 'Mmetụta yaltugol e ukọ ndiwụt, heewde noppito ntị ime e caggal ma\'auni.',
      recommendations: ['Yak ko kwanta', 'Kpan motsin ukọ kwatsam', 'Yụñụ mmọñ', 'Waɗ motsa ma\'auni', 'Yọọ dọkita noppito']
    },
    tiv: {
      name: 'Ikyume',
      description: 'Mmetụta yaltugol e ikyume, heewde noppito ta ime e caggal ma\'auni.',
      recommendations: ['Yak ko kwanta', 'Kpan motsin ken kwatsam', 'Yam mmọñ', 'Waɗ motsa ma\'auni', 'Doo dọkita noppito']
    },
    ijc: {
      name: 'Ụrụ Tẹin',
      description: 'Mmetụta yaltugol e ụrụ tẹin, heewde noppito ta ime e caggal ma\'auni.',
      recommendations: ['Yak ko kwanta', 'Kpan motsin ụrụ kwatsam', 'Yụñụ sọ', 'Waɗ motsa ma\'auni', 'Yẹ dọkita noppito']
    },
    bin: {
      name: 'Ukpọn Koko',
      description: 'Mmetụta yaltugol e ukpọn koko, heewde noppito ntị ime e caggal ma\'auni.',
      recommendations: ['Yak ko kwanta', 'Kpan motsin ukọ kwatsam', 'Yụñụ mmọñ', 'Waɗ motsa ma\'auni', 'Yọọ dọkita noppito']
    }
  },
  muscle_strain: {
    en: {
      name: 'Muscle Strain',
      description: 'Injury to a muscle or tendon, often caused by overexertion or improper movement.',
      recommendations: ['Rest the affected area', 'Apply ice for first 48 hours', 'Use compression bandage', 'Elevate the area if possible', 'Gentle stretching after initial healing']
    },
    es: {
      name: 'Tensión Muscular',
      description: 'Lesión en un músculo o tendón, a menudo causada por esfuerzo excesivo o movimiento inadecuado.',
      recommendations: ['Descansar el área afectada', 'Aplicar hielo durante las primeras 48 horas', 'Usar vendaje de compresión', 'Elevar el área si es posible', 'Estiramiento suave después de la curación inicial']
    },
    fr: {
      name: 'Tension Musculaire',
      description: 'Blessure d\'un muscle ou d\'un tendon, souvent causée par un effort excessif ou un mouvement inapproprié.',
      recommendations: ['Reposer la zone affectée', 'Appliquer de la glace pendant les 48 premières heures', 'Utiliser un bandage de compression', 'Surélever la zone si possible', 'Étirement doux après la guérison initiale']
    },
    de: {
      name: 'Muskelzerrung',
      description: 'Verletzung eines Muskels oder einer Sehne, oft verursacht durch Überanstrengung oder falsche Bewegung.',
      recommendations: ['Betroffene Stelle schonen', 'In den ersten 48 Stunden Eis auftragen', 'Kompressionsbandage verwenden', 'Bereich wenn möglich hochlagern', 'Sanftes Dehnen nach der ersten Heilung']
    },
    zh: {
      name: '肌肉拉伤',
      description: '肌肉或肌腱的损伤，通常由过度用力或不当运动引起。',
      recommendations: ['让受影响的部位休息', '在前48小时内冰敷', '使用压缩绷带', '如果可能，抬高该部位', '初步愈合后进行轻柔拉伸']
    },
    ar: {
      name: 'إجهاد العضلات',
      description: 'إصابة في العضلة أو الوتر، غالباً ما تكون ناتجة عن الإجهاد المفرط أو الحركة غير الصحيحة.',
      recommendations: ['إراحة المنطقة المصابة', 'وضع الثلج خلال أول 48 ساعة', 'استخدام ضمادة ضاغطة', 'رفع المنطقة إن أمكن', 'التمدد اللطيف بعد الشفاء الأولي']
    },
    ha: {
      name: 'Tsinkewar Tsoka',
      description: 'Rauni ga tsoka ko jijiya, galibi yana faruwa sakamakon wuce gona da iri ko motsi mara kyau.',
      recommendations: ['Huta wurin da aka shafa', 'Sanya sanyi na sa\'o\'i 48 na farko', 'Yi amfani da bandeji mai matsi', 'Daɗa wurin idan zai yiwu', 'Mike mai sauƙi bayan farfadowa na farko']
    },
    yo: {
      name: 'Irọra Iṣan',
      description: 'Ipalara si iṣan tabi okun-iṣan, nigbagbogbo lati ohun ti o pọ ju tabi gbigbe ti ko tọ.',
      recommendations: ['Fi ibi ti o ni ipa sinmi', 'Fi yinyin si fun wakati 48 akọkọ', 'Lo asibọ fifunni', 'Gbe ibi naa soke ti o ba ṣee ṣe', 'Nà ara rẹ rọra lẹhin iwosan akọkọ']
    },
    ig: {
      name: 'Mgbu Akwara',
      description: 'Mmerụ ahụ na akwara ma ọ bụ eriri akwara, nke na-abụkarị n\'ihi ọrụ gabigara ókè ma ọ bụ mmegharị na-ezighị ezi.',
      recommendations: ['Zuru ike mpaghara metụtara', 'Tinye ice maka awa 48 mbụ', 'Jiri bandeeji mkpakọ', 'Welie mpaghara ahụ ma ọ bụrụ na ọ ga-ekwe omume', 'Setịpụ nwayọọ mgbe ọgwụgwọ mbụ gasịrị']
    },
    pcm: {
      name: 'Muscle Pain',
      description: 'When your muscle tear small, e fit happen if you do too much work or move body wrongly.',
      recommendations: ['Make the place rest', 'Put ice for the first 48 hours', 'Use tight bandage', 'Raise the place up if you fit', 'Do small stretch after e don heal small']
    },
    ff: {
      name: 'Yejji Ɓernde',
      description: 'Rauni ɓernde e jijiya, heewde wuce gona e motsi mara kyau.',
      recommendations: ['Yaaru wurin metụtara', 'Sirtin tolol sahaa 48 gadano', 'Huutoro bandeji matsi', 'Daɗa wurin so ɗum haani', 'Mike tolnol caggal farfadowa gadano']
    },
    kr: {
      name: 'Wuye Tsoka',
      description: 'Rauni tsoka e jijiya, heewde wuce ngadaro e motsi kambe ngamtoro.',
      recommendations: ['Kursi wurin metụtara', 'Sanya tolol sahaa 48 gadano', 'Yi bandeji matsi', 'Daɗa wurin so haani', 'Mike tolnol caggal farko']
    },
    ibb: {
      name: 'Mkpọ Ɓernde',
      description: 'Rauni ɓernde e jijiya, heewde wuce ngadaro e motsi kambe.',
      recommendations: ['Yak wurin metụtara', 'Sanya tolol sahaa 48 gadano', 'Yi bandeji matsi', 'Daɗa wurin so haani', 'Mike tolnol caggal farko']
    },
    tiv: {
      name: 'U Ter Ɓernde',
      description: 'Rauni ɓernde e jijiya, heewde wuce ken e motsi kambe.',
      recommendations: ['Yar wurin metụtara', 'Sanya tolol sahaa 48 gadano', 'Yi bandeji matsi', 'Daɗa wurin so haani', 'Mike tolnol caggal farko']
    },
    ijc: {
      name: 'Tẹin Ɓernde',
      description: 'Rauni ɓernde e jijiya, heewde wuce bara e motsi kambe.',
      recommendations: ['Kiri wurin metụtara', 'Tụọ tolol sahaa 48 gadano', 'Yi bandeji matsi', 'Daɗa wurin so haani', 'Mike tolnol caggal farko']
    },
    bin: {
      name: 'Ukpọn Ɓernde',
      description: 'Rauni ɓernde e jijiya, heewde wuce guẹguẹ e motsi kambe.',
      recommendations: ['Yak wurin metụtara', 'Tụọ tolol sahaa 48 gadano', 'Yi bandeji matsi', 'Daɗa wurin so haani', 'Mike tolnol caggal farko']
    }
  }
};

// NLP entity extraction
function extractEntities(text: string, language: Language): Array<{ text: string; type: 'symptom' | 'body_part' | 'duration' | 'severity'; confidence: number }> {
  const entities: Array<{ text: string; type: 'symptom' | 'body_part' | 'duration' | 'severity'; confidence: number }> = [];
  const lowerText = text.toLowerCase();
  const kb = medicalKnowledgeBase[language] || medicalKnowledgeBase.en;

  // Extract symptoms and body parts
  Object.entries(kb.keywords).forEach(([keyword, data]) => {
    if (lowerText.includes(keyword.toLowerCase())) {
      entities.push({
        text: keyword,
        type: 'symptom',
        confidence: 0.85 + Math.random() * 0.1
      });
      
      if (data.bodyPart && data.bodyPart !== 'body') {
        entities.push({
          text: data.bodyPart,
          type: 'body_part',
          confidence: 0.75 + Math.random() * 0.15
        });
      }
    }
  });

  // Extract duration
  kb.durationWords.forEach(word => {
    const regex = new RegExp(`\\d+\\s*${word}`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(match => {
        entities.push({
          text: match,
          type: 'duration',
          confidence: 0.9 + Math.random() * 0.1
        });
      });
    }
  });

  // Extract severity
  kb.severityWords.forEach(word => {
    if (lowerText.includes(word.toLowerCase())) {
      entities.push({
        text: word,
        type: 'severity',
        confidence: 0.8 + Math.random() * 0.15
      });
    }
  });

  return entities;
}

// Generate diagnoses based on detected symptoms
function generateDiagnoses(text: string, language: Language, entities: any[]): any[] {
  const lowerText = text.toLowerCase();
  const kb = medicalKnowledgeBase[language] || medicalKnowledgeBase.en;
  const conditionScores: Record<string, number> = {};

  // Score conditions based on keyword matches
  Object.entries(kb.keywords).forEach(([keyword, data]) => {
    if (lowerText.includes(keyword.toLowerCase())) {
      data.conditions.forEach(condition => {
        conditionScores[condition] = (conditionScores[condition] || 0) + 1;
      });
    }
  });

  // Convert to diagnoses with confidence scores
  const diagnoses = Object.entries(conditionScores)
    .map(([condition, score]) => {
      const baseConfidence = Math.min(0.95, 0.4 + (score * 0.2));
      const variation = (Math.random() - 0.5) * 0.1;
      const confidence = Math.max(0.3, Math.min(0.95, baseConfidence + variation));

      const data = conditionData[condition]?.[language] || conditionData[condition]?.en;
      
      return {
        condition: data?.name || condition,
        confidence,
        description: data?.description || 'A medical condition requiring professional evaluation.',
        recommendations: data?.recommendations || ['Consult a healthcare professional']
      };
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  if (diagnoses.length === 0) {
    return [{
      condition: 'No clear match found',
      confidence: 0.3,
      description: 'The current symptom text does not match known patterns in this demo knowledge base.',
      recommendations: [
        'Try describing key symptoms directly (for example: fever, cough, chest pain)',
        'Include duration and severity (for example: 3 days, severe)',
        'Consult a healthcare professional for proper diagnosis'
      ]
    }];
  }

  return diagnoses;
}

export function analyzeSymptoms(symptoms: string, language: Language): DiagnosticResult {
  const entities = extractEntities(symptoms, language);
  const diagnoses = generateDiagnoses(symptoms, language, entities);

  return {
    id: `diag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    language,
    symptoms,
    diagnoses,
    entities
  };
}
