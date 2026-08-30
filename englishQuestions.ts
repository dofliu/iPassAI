import type { Question } from "./questions";

export const ENGLISH_B2_SUBJECT = "英文能力｜CEFR B2";
export const CEFR_B2_SOURCE_URL = "https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors";
const CEFR_B2_SOURCE = "CEFR B2 能力描述；本站依公開框架自編";

type Seed = {
  stem: string;
  correct: string;
  distractors: [string, string, string];
  topic: string;
  explanation: string;
  stimulus?: string;
};

function rotateOptions(seed: Seed, index: number): { options: [string, string, string, string]; answer: number } {
  const options = [seed.correct, ...seed.distractors];
  const offset = index % 4;
  const rotated = [...options.slice(offset), ...options.slice(0, offset)] as [string, string, string, string];
  return { options: rotated, answer: (4 - offset) % 4 };
}

function makeQuestions(prefix: string, seeds: Seed[], difficulty: Question["difficulty"]): Question[] {
  return seeds.map((seed, index) => {
    const { options, answer } = rotateOptions(seed, index);
    return {
      id: `B2-ENG-${prefix}-${String(index + 1).padStart(3, "0")}`,
      level: "中級",
      subject: ENGLISH_B2_SUBJECT,
      topic: seed.topic,
      difficulty,
      stem: seed.stem,
      options,
      answer,
      explanation: `${seed.explanation} 此題對應 CEFR B2 的${seed.topic}能力。`,
      trap: "先從語境、語氣與句法功能判斷，再排除只在局部看似合理但不符合完整語意的選項。",
      source: CEFR_B2_SOURCE,
      sourceUrl: CEFR_B2_SOURCE_URL,
      stimulus: seed.stimulus,
    };
  });
}

const vocabulary: Seed[] = [
  { stem: "The committee decided to ___ the proposal until more evidence was available.", correct: "defer", distractors: ["infer", "confer", "refer"], topic: "Vocabulary in context", explanation: "Defer means to postpone a decision or action; the sentence requires postponement." },
  { stem: "The new policy is intended to ___ unnecessary administrative costs.", correct: "eliminate", distractors: ["compile", "allocate", "illustrate"], topic: "Vocabulary in context", explanation: "Eliminate means remove completely, which fits reducing unnecessary costs." },
  { stem: "Her explanation was clear and ___, so everyone understood the procedure.", correct: "concise", distractors: ["reluctant", "ambiguous", "consecutive"], topic: "Vocabulary in context", explanation: "Concise describes communication that is brief without losing the necessary meaning." },
  { stem: "The report draws attention to a ___ gap between policy and practice.", correct: "substantial", distractors: ["fragile", "temporary", "obedient"], topic: "Vocabulary in context", explanation: "Substantial means considerable or significant, appropriate for a large gap." },
  { stem: "The researcher remained ___ about the result until the sample was independently checked.", correct: "cautious", distractors: ["delighted", "arbitrary", "conventional"], topic: "Vocabulary in context", explanation: "Cautious means careful to avoid risk, matching the need for verification." },
  { stem: "The witness gave a ___ account of what happened, including times and locations.", correct: "detailed", distractors: ["vague", "irrelevant", "artificial"], topic: "Vocabulary in context", explanation: "Detailed means containing many relevant facts, as indicated by times and locations." },
  { stem: "The two studies reached ___ conclusions despite using different methods.", correct: "consistent", distractors: ["invisible", "contemporary", "scarce"], topic: "Vocabulary in context", explanation: "Consistent conclusions agree with each other." },
  { stem: "The manager tried to ___ the conflict before it affected the whole team.", correct: "resolve", distractors: ["provoke", "exclude", "withdraw"], topic: "Vocabulary in context", explanation: "Resolve means settle a problem or disagreement." },
  { stem: "The museum is working to ___ the building without changing its historic character.", correct: "preserve", distractors: ["overlook", "speculate", "distribute"], topic: "Vocabulary in context", explanation: "Preserve means protect something from damage or change." },
  { stem: "The figures should be treated as ___ because the survey included only twenty participants.", correct: "tentative", distractors: ["permanent", "mandatory", "identical"], topic: "Vocabulary in context", explanation: "Tentative means not yet certain or final." },
  { stem: "The course aims to ___ students with the skills needed for independent research.", correct: "equip", distractors: ["deprive", "interrupt", "confine"], topic: "Vocabulary in context", explanation: "Equip means provide someone with a useful skill or resource." },
  { stem: "The proposal was rejected because its financial assumptions were not ___.", correct: "realistic", distractors: ["superficial", "punctual", "sensitive"], topic: "Vocabulary in context", explanation: "Realistic assumptions are practical and compatible with actual conditions." },
  { stem: "The speaker used an example to ___ the difference between the two approaches.", correct: "clarify", distractors: ["constrain", "retain", "postpone"], topic: "Vocabulary in context", explanation: "Clarify means make an idea easier to understand." },
  { stem: "The company must ___ with the safety regulations before opening the facility.", correct: "comply", distractors: ["object", "presume", "retain"], topic: "Vocabulary in context", explanation: "Comply with means act according to a rule or requirement." },
  { stem: "The article provides a ___ overview rather than focusing on one isolated event.", correct: "comprehensive", distractors: ["accidental", "predictable", "hostile"], topic: "Vocabulary in context", explanation: "Comprehensive means covering all or most relevant aspects." },
  { stem: "The team made a ___ attempt to reduce energy consumption, but the effect was limited.", correct: "deliberate", distractors: ["random", "fragile", "verbal"], topic: "Vocabulary in context", explanation: "Deliberate means planned and intentional." },
  { stem: "The evidence is ___ with the explanation offered by the original report.", correct: "compatible", distractors: ["punctual", "scarce", "transparent"], topic: "Vocabulary in context", explanation: "Compatible evidence does not conflict with the explanation." },
  { stem: "The survey revealed a ___ preference for flexible working hours among respondents.", correct: "prevalent", distractors: ["optional", "rigid", "isolated"], topic: "Vocabulary in context", explanation: "Prevalent means common or widespread." },
  { stem: "The editor asked the author to ___ the claim because it was stronger than the evidence.", correct: "qualify", distractors: ["accelerate", "imitate", "commute"], topic: "Vocabulary in context", explanation: "Qualify a claim means limit or modify it so it is more accurate." },
  { stem: "The project was delayed by a ___ shortage of qualified technicians.", correct: "temporary", distractors: ["symbolic", "permanent", "deliberate"], topic: "Vocabulary in context", explanation: "Temporary means lasting for a limited period, which explains a delay rather than a permanent condition." },
  { stem: "The instructions are ___ enough for users to follow without technical support.", correct: "straightforward", distractors: ["controversial", "excessive", "obsolete"], topic: "Vocabulary in context", explanation: "Straightforward means simple and easy to understand." },
  { stem: "The journalist was careful not to ___ the interviewee's words out of context.", correct: "distort", distractors: ["assemble", "restore", "consult"], topic: "Vocabulary in context", explanation: "Distort means represent something inaccurately or misleadingly." },
  { stem: "The agreement is legally ___ only after both parties sign it.", correct: "binding", distractors: ["casual", "distinct", "optional"], topic: "Vocabulary in context", explanation: "Binding describes an agreement that creates an obligation." },
  { stem: "The findings are ___ to several other regions, although local conditions differ.", correct: "relevant", distractors: ["vertical", "fragile", "incidental"], topic: "Vocabulary in context", explanation: "Relevant means connected with the matter being considered." },
  { stem: "The training helped staff ___ potential risks before they became serious problems.", correct: "identify", distractors: ["celebrate", "postpone", "exclude"], topic: "Vocabulary in context", explanation: "Identify means recognize or establish what something is." },
];

const grammar: Seed[] = [
  { stem: "By the time the meeting starts, the director ___ the revised figures.", correct: "will have reviewed", distractors: ["reviews", "reviewed", "has reviewing"], topic: "Grammar and sentence control", explanation: "The future perfect describes an action completed before a future time." },
  { stem: "If the data ___ more reliable, we could draw a stronger conclusion.", correct: "were", distractors: ["are", "will be", "have been"], topic: "Grammar and sentence control", explanation: "The second conditional uses a past form in the if-clause for a hypothetical present situation." },
  { stem: "The report, ___ was published last week, has already influenced the debate.", correct: "which", distractors: ["what", "where", "whose"], topic: "Grammar and sentence control", explanation: "Which introduces a non-defining relative clause referring to the report." },
  { stem: "The equipment needs ___ before it can be used safely.", correct: "to be inspected", distractors: ["inspecting it", "inspect", "to inspect it by"], topic: "Grammar and sentence control", explanation: "After needs in this passive meaning, to be inspected expresses the required action on the equipment." },
  { stem: "She denied ___ the confidential file to anyone outside the team.", correct: "having sent", distractors: ["to send", "send", "that sending"], topic: "Grammar and sentence control", explanation: "Deny is followed by a gerund; having sent emphasizes that the alleged action occurred earlier." },
  { stem: "Only after the audit ___ the scale of the problem become clear.", correct: "did", distractors: ["has", "was", "had"], topic: "Grammar and sentence control", explanation: "Negative or restrictive adverbials at the beginning trigger subject–auxiliary inversion." },
  { stem: "The software is designed to prevent users ___ the same form twice.", correct: "from submitting", distractors: ["to submit", "submit", "for submitting"], topic: "Grammar and sentence control", explanation: "Prevent is followed by object plus from and a gerund." },
  { stem: "The more carefully the instructions are written, ___ the process will be.", correct: "the smoother", distractors: ["smoother than", "the smoothest", "smoothly"], topic: "Grammar and sentence control", explanation: "The correlative comparative pattern is the more..., the + comparative." },
  { stem: "It is essential that every applicant ___ proof of identity.", correct: "provide", distractors: ["provides", "provided", "will providing"], topic: "Grammar and sentence control", explanation: "Formal mandative constructions use the base form after essential that." },
  { stem: "The researcher suggested that the experiment ___ under controlled conditions.", correct: "be repeated", distractors: ["is repeating", "repeated to", "will repeated"], topic: "Grammar and sentence control", explanation: "Suggest that in formal English can take a passive mandative subjunctive: be repeated." },
  { stem: "The policy was introduced with a view to ___ workplace accidents.", correct: "reducing", distractors: ["reduce", "reduced", "have reduced"], topic: "Grammar and sentence control", explanation: "With a view to is followed by a gerund because to functions as a preposition." },
  { stem: "Having ___ the contract, both parties received a digital copy.", correct: "signed", distractors: ["signing to", "been sign", "to sign"], topic: "Grammar and sentence control", explanation: "A perfect participle clause uses having plus the past participle for an earlier completed action." },
  { stem: "The figures are believed ___ by an error in the original spreadsheet.", correct: "to have been affected", distractors: ["affecting", "to affect by", "having affect"], topic: "Grammar and sentence control", explanation: "The passive reporting structure with an earlier effect requires to have been affected." },
  { stem: "Despite ___ several warnings, the company continued the unsafe practice.", correct: "having received", distractors: ["receive", "to receiving", "received to"], topic: "Grammar and sentence control", explanation: "Despite is a preposition and takes a noun or gerund phrase; perfect form marks the earlier warnings." },
  { stem: "The candidate spoke as though she ___ the issue personally.", correct: "had investigated", distractors: ["investigates", "will investigate", "has investigating"], topic: "Grammar and sentence control", explanation: "As though referring to an apparently earlier action uses the past perfect." },
  { stem: "No sooner ___ the announcement made than questions began to arise.", correct: "had they made", distractors: ["they had made", "did they making", "they make"], topic: "Grammar and sentence control", explanation: "No sooner at the beginning requires inversion and is followed by than." },
  { stem: "The committee could not agree on ___ should lead the next phase.", correct: "who", distractors: ["which that", "what person did", "whose one"], topic: "Grammar and sentence control", explanation: "Who functions as the subject of the embedded question." },
  { stem: "The proposal is worth ___ before a final decision is made.", correct: "considering", distractors: ["to consider it", "considered to", "consider"], topic: "Grammar and sentence control", explanation: "Worth is followed by a gerund, not an infinitive." },
  { stem: "The findings would have been different if the researchers ___ a larger sample.", correct: "had used", distractors: ["use", "would use", "have using"], topic: "Grammar and sentence control", explanation: "The third conditional uses past perfect in the if-clause for an unreal past condition." },
  { stem: "The manager had the documents ___ by an independent lawyer.", correct: "checked", distractors: ["checking", "to checking", "check by"], topic: "Grammar and sentence control", explanation: "Have something done uses have plus object plus past participle." },
  { stem: "There is little point in ___ the deadline if the quality declines.", correct: "extending", distractors: ["extend", "to extending it", "extended"], topic: "Grammar and sentence control", explanation: "Point in is followed by a gerund phrase." },
  { stem: "The survey results indicate that consumers are becoming ___ price-sensitive.", correct: "increasingly", distractors: ["increase", "increased", "increasing"], topic: "Grammar and sentence control", explanation: "Increasingly is the adverb modifying the adjective price-sensitive." },
  { stem: "The device will operate efficiently provided that it ___ regularly.", correct: "is maintained", distractors: ["maintains", "will maintain", "maintained it"], topic: "Grammar and sentence control", explanation: "Provided that introduces a real condition; the device receives maintenance, so passive voice is needed." },
  { stem: "The speaker's argument is not so much incorrect ___ incomplete.", correct: "as", distractors: ["than", "but", "that"], topic: "Grammar and sentence control", explanation: "Not so much X as Y contrasts the degree or type of two descriptions." },
  { stem: "The team is expected ___ its recommendations by Friday.", correct: "to publish", distractors: ["publishing to", "publish it to", "to publishing"], topic: "Grammar and sentence control", explanation: "The passive reporting structure expected to is followed by the infinitive." },
];

const reading: Seed[] = [
  { stem: "Read: 'The library extended its opening hours, but visitor numbers rose only slightly. A follow-up survey found that most residents were unaware of the change.' What is the main explanation for the limited increase?", correct: "People did not know about the new hours.", distractors: ["The library reduced its collection.", "Visitors disliked the building's design.", "The survey was cancelled."], topic: "Reading for main ideas", explanation: "The survey directly identifies lack of awareness as the reason visitor numbers changed little." },
  { stem: "Read: 'Although the pilot reduced delivery times, it required twice as many staff during peak periods. Managers therefore postponed expansion.' What influenced the decision?", correct: "The staffing cost of scaling up.", distractors: ["A fall in customer demand.", "A legal ban on delivery.", "A failure to reduce delivery times."], topic: "Reading for inference", explanation: "The benefit was real, but the extra staffing requirement made expansion impractical at that stage." },
  { stem: "Read: 'The article does not reject remote work; instead, it argues that its success depends on clear communication routines and suitable tasks.' Which position does the author take?", correct: "Remote work can work under the right conditions.", distractors: ["Remote work is always ineffective.", "Only technical tasks can be done remotely.", "Communication is unnecessary online."], topic: "Reading for writer attitude", explanation: "The contrast marker instead signals a qualified, conditional position rather than outright rejection." },
  { stem: "Read: 'The museum's attendance recovered after free entry was introduced on Fridays, though the director warns that the figures may reflect a temporary novelty effect.' What caution is expressed?", correct: "The increase may not continue.", distractors: ["Free entry was legally prohibited.", "Friday was the quietest day before the change.", "The museum stopped measuring attendance."], topic: "Reading for inference", explanation: "A novelty effect means initial interest may fade, so the increase is not necessarily permanent." },
  { stem: "Read: 'The report uses the phrase “associated with” rather than “caused by” when discussing exercise and wellbeing.' Why?", correct: "The evidence shows a relationship but not definite causation.", distractors: ["The two variables were never measured.", "The report is a work of fiction.", "Exercise and wellbeing are identical concepts."], topic: "Reading for precise meaning", explanation: "Associated with is deliberately more cautious than caused by and avoids claiming proof of causality." },
  { stem: "Read: 'When the first prototype failed, the engineers did not discard the project. They used the test results to redesign the cooling system.' What does this show?", correct: "Failure was used as feedback.", distractors: ["The prototype was never tested.", "The engineers abandoned the objective.", "The cooling system was already perfect."], topic: "Reading for main ideas", explanation: "The second sentence explains that the failure informed a redesign." },
  { stem: "Read: 'The town's new cycle lanes are popular with commuters, but shop owners report fewer short visits by drivers. The council is reviewing loading arrangements.' What issue is being addressed?", correct: "How to balance access with safer streets.", distractors: ["Whether cycling is physically possible.", "How to close all local shops.", "Why commuters refuse public transport."], topic: "Reading for synthesis", explanation: "The passage presents a benefit and a commercial concern, followed by a review of access arrangements." },
  { stem: "Read: 'The author cites three small studies and notes that their participants were self-selected. The conclusion is described as promising rather than conclusive.' How strong is the evidence?", correct: "Encouraging but limited.", distractors: ["Definitive and universal.", "Entirely irrelevant.", "Based on a national census."], topic: "Reading for writer attitude", explanation: "Small self-selected samples justify a cautious interpretation, not a final conclusion." },
  { stem: "Read: 'The software update removed several visible features. According to the designer, those features had been used by less than one percent of customers and slowed the interface for everyone.' What was the rationale?", correct: "Prioritising overall performance over rare features.", distractors: ["Making the software harder for every user.", "Adding more features for specialist users.", "Responding to a shortage of customer data."], topic: "Reading for inference", explanation: "The designer weighed low usage against a general performance cost." },
  { stem: "Read: 'A grant will fund the first year of the project, but the team must demonstrate measurable outcomes before renewal.' What condition applies?", correct: "Further funding depends on results.", distractors: ["The first year has no funding.", "The project cannot collect measurements.", "Renewal is guaranteed in advance."], topic: "Reading for detail", explanation: "The phrase before renewal establishes a results-based condition for future funding." },
  { stem: "Read: 'The review praises the book's accessible examples but criticises its lack of engagement with opposing theories.' Which summary is most accurate?", correct: "It is clear but not sufficiently balanced.", distractors: ["It is inaccessible and theoretically comprehensive.", "It contains no examples or criticism.", "It is praised without qualification."], topic: "Reading for synthesis", explanation: "The review combines a positive comment on clarity with a criticism of limited balance." },
  { stem: "Read: 'Despite the forecast of heavy rain, the match went ahead because the drainage system had recently been upgraded.' What allowed the match to proceed?", correct: "Improved drainage.", distractors: ["A change in the forecast.", "The cancellation of the match.", "The absence of any rain forecast."], topic: "Reading for detail", explanation: "Because introduces the direct reason the match could proceed." },
  { stem: "Read: 'The company claims the packaging is recyclable. The report adds that local facilities accept only part of the material.' What qualification is implied?", correct: "Recyclability depends on local facilities.", distractors: ["The packaging cannot be produced.", "Every facility accepts all materials.", "The company makes no environmental claim."], topic: "Reading for precise meaning", explanation: "The report limits the broad claim by adding a condition about local processing capacity." },
  { stem: "Read: 'Rather than replacing face-to-face teaching, the platform was introduced to give students additional practice between lessons.' What is its intended role?", correct: "A supplement to classroom teaching.", distractors: ["A complete replacement for teachers.", "A tool used only during examinations.", "A platform for removing practice."], topic: "Reading for main ideas", explanation: "Rather than replacing explicitly contrasts the platform with replacement and identifies a supplementary role." },
  { stem: "Read: 'The first estimate assumed stable fuel prices. After prices rose sharply, the projected savings disappeared.' Why did the estimate change?", correct: "Its original assumption no longer held.", distractors: ["The project used less fuel than expected.", "Fuel prices remained stable.", "Savings were never included in the estimate."], topic: "Reading for cause and effect", explanation: "The rise in fuel prices invalidated the condition on which the estimate depended." },
  { stem: "Read: 'The article distinguishes between access to information and the ability to evaluate it. It argues that the latter is increasingly important online.' What distinction is made?", correct: "Finding information is different from judging its quality.", distractors: ["Online information is always accurate.", "Evaluation makes access impossible.", "Information and judgement are identical."], topic: "Reading for precise meaning", explanation: "The passage explicitly contrasts obtaining information with evaluating reliability." },
  { stem: "Read: 'The neighbourhood garden began as a food-growing project, but meetings gradually became its most valued feature.' What unexpected development occurred?", correct: "The social function became more important than the original one.", distractors: ["Food growing was banned immediately.", "Meetings were never held.", "The garden became a private office."], topic: "Reading for inference", explanation: "The contrast between began as and gradually shows a shift toward community interaction." },
  { stem: "Read: 'The reviewer accepts the figures but questions whether the sample represents rural households.' What concern is raised?", correct: "The findings may not generalise to all groups.", distractors: ["The figures were calculated incorrectly.", "Rural households were overpaid.", "The sample included no measurements."], topic: "Reading for writer attitude", explanation: "Questioning representativeness concerns whether results can be applied beyond the sampled group." },
  { stem: "Read: 'The museum's digital archive is free to browse, while high-resolution downloads require registration.' Which statement is true?", correct: "Viewing is open, but downloads have an extra requirement.", distractors: ["All content requires payment.", "Downloads are impossible.", "Registration is needed only to enter the museum."], topic: "Reading for detail", explanation: "While contrasts the unrestricted browsing option with the registration requirement for downloads." },
  { stem: "Read: 'The manager's email was brief, but the repeated use of “we” and “together” made the message sound reassuring.' What created the tone?", correct: "Inclusive language.", distractors: ["Technical vocabulary.", "A threatening command.", "A lack of any audience reference."], topic: "Reading for writer attitude", explanation: "We and together include the audience and create a sense of shared responsibility." },
  { stem: "Read: 'The experiment produced a result contrary to the initial hypothesis. The researchers describe this as useful because it reveals a limitation in the current model.' How do they view the result?", correct: "As evidence that can improve the model.", distractors: ["As proof that experiments are useless.", "As confirmation of the original hypothesis.", "As a result that should be hidden."], topic: "Reading for inference", explanation: "The researchers treat an unexpected result as information about model limitations." },
  { stem: "Read: 'Applications submitted after the deadline will be considered only if places remain.' What does this mean?", correct: "Late applications are possible but not guaranteed consideration.", distractors: ["Late applications always receive priority.", "The deadline has been removed.", "No application can ever be submitted."], topic: "Reading for detail", explanation: "Only if places remain makes consideration conditional rather than guaranteed." },
  { stem: "Read: 'The author begins with a personal story, then moves to survey data and ends by acknowledging a limitation.' What is the likely purpose of this structure?", correct: "To engage readers, support the point, and remain cautious.", distractors: ["To avoid presenting any evidence.", "To replace the conclusion with an advertisement.", "To make the argument entirely fictional."], topic: "Reading for text organisation", explanation: "The sequence combines engagement, evidence and a qualification of the claim." },
  { stem: "Read: 'Although the device is more expensive initially, its lower maintenance requirements make it cheaper over five years.' What comparison is being made?", correct: "Higher upfront cost versus lower long-term cost.", distractors: ["A cheap device with high reliability.", "Two devices with identical costs.", "Maintenance that becomes more expensive over time."], topic: "Reading for comparison", explanation: "Although marks the contrast between initial price and total cost over time." },
];

const functional: Seed[] = [
  { stem: "Your colleague proposes a plan you partly support but think needs more detail. What is the most appropriate response?", correct: "The overall idea is promising, but could we clarify the implementation steps?", distractors: ["This is obviously perfect; change nothing.", "I refuse to discuss any plan.", "You must accept my completely different idea."], topic: "Functional language and interaction", explanation: "The response acknowledges the idea while diplomatically requesting clarification." },
  { stem: "You need to interrupt a formal presentation to ask for clarification. What should you say?", correct: "Sorry to interrupt, but could you clarify what you mean by the final point?", distractors: ["Stop. That makes no sense.", "Talk faster and explain it now.", "I will ignore the point entirely."], topic: "Functional language and interaction", explanation: "The phrasing is polite, direct and appropriate for a formal interaction." },
  { stem: "A service has not replied to your previous email. Which follow-up opening is most suitable?", correct: "I am writing to follow up on my email of 12 May regarding the application.", distractors: ["Why have you ignored me again?", "Answer immediately or else.", "You probably lost my email, didn't you?"], topic: "Functional language and interaction", explanation: "The opening identifies the previous message and topic without making an unsupported accusation." },
  { stem: "You disagree with a proposal in a meeting but want to keep the discussion constructive. What should you say?", correct: "I see the advantage, although I am concerned about the effect on smaller teams.", distractors: ["That is a ridiculous suggestion.", "No one could possibly agree with you.", "I have nothing useful to add."], topic: "Functional language and interaction", explanation: "This hedged disagreement recognises a benefit and gives a specific reason for concern." },
  { stem: "You want a friend to recommend a reliable course. Which question is natural and specific?", correct: "Would you happen to know of a course that focuses on academic writing?", distractors: ["Tell me every course you know.", "You know a course, yes?", "Which course is the only course?"], topic: "Functional language and interaction", explanation: "Would you happen to know is a polite request and the relative clause specifies the need." },
  { stem: "You must decline an invitation because of a prior commitment. What is the best reply?", correct: "Thanks very much for inviting me, but unfortunately I already have an arrangement that evening.", distractors: ["No. Do not ask me again.", "I cannot attend because invitations are inconvenient.", "Maybe, although I know I will not go."], topic: "Functional language and interaction", explanation: "The reply expresses appreciation, gives a brief reason and declines clearly." },
  { stem: "A customer asks when a delayed order will arrive, but you cannot promise a date. What should you say?", correct: "I cannot confirm a delivery date yet, but I will update you as soon as I have one.", distractors: ["It will definitely arrive tomorrow.", "There is no point asking us.", "Your order is not our responsibility."], topic: "Functional language and interaction", explanation: "The response is honest about uncertainty and offers a concrete next action." },
  { stem: "You want to make a suggestion at the end of a discussion. Which phrase fits a professional setting?", correct: "Perhaps we could trial the approach with a smaller group first.", distractors: ["Just do what I said.", "There is only one possible answer.", "You should have thought of this earlier."], topic: "Functional language and interaction", explanation: "Perhaps we could is a measured suggestion, and a smaller trial reduces risk." },
  { stem: "You are writing a review and want to introduce a limitation. Which linking phrase is appropriate?", correct: "That said, the study is based on a relatively small sample.", distractors: ["For no reason, the study is perfect.", "As a result of nothing, the sample is large.", "In contrast to agreeing, there is no limitation."], topic: "Functional language and interaction", explanation: "That said introduces a contrasting qualification after a preceding point." },
  { stem: "A colleague has helped you meet a deadline. What is a suitable professional thank-you?", correct: "I really appreciate your help; we would not have met the deadline without it.", distractors: ["You did what you were supposed to do.", "The deadline was unimportant anyway.", "I expected you to solve everything."], topic: "Functional language and interaction", explanation: "The response clearly expresses gratitude and links the help to a concrete result." },
  { stem: "You need to ask a speaker to repeat one detail. Which request is most polite?", correct: "Could you possibly go over the figures for the second quarter again?", distractors: ["Repeat that.", "I was not listening, start over.", "The figures are impossible to hear."], topic: "Functional language and interaction", explanation: "Could you possibly and the specific request make the interruption courteous and efficient." },
  { stem: "You want to soften a claim in an academic paragraph because the evidence is limited. Which wording is best?", correct: "These findings appear to suggest that the approach may be beneficial.", distractors: ["These findings prove the approach always works.", "Nobody can question this result.", "The approach is certainly perfect."], topic: "Functional language and interaction", explanation: "Appear to suggest and may be beneficial appropriately signal limited certainty." },
  { stem: "Your team has two possible dates and needs a decision. How can you move the discussion forward?", correct: "Could we agree on a preferred date today and keep the other as a backup?", distractors: ["Choose now or the project is over.", "Dates do not matter at all.", "I will decide without consulting anyone."], topic: "Functional language and interaction", explanation: "The proposal offers a practical decision rule while leaving a contingency." },
  { stem: "You are introducing evidence from another source in a report. Which sentence is appropriate?", correct: "Recent survey evidence supports this interpretation, particularly among younger respondents.", distractors: ["Somebody somewhere says this is true.", "Everyone agrees, so evidence is unnecessary.", "The source is irrelevant but I will cite it."], topic: "Functional language and interaction", explanation: "The sentence identifies the evidence and gives its relevant scope without overgeneralising." },
  { stem: "A visitor asks for directions, and you are unsure. What is the most helpful response?", correct: "I am not completely sure, but the information desk should be able to point you in the right direction.", distractors: ["Go anywhere; it is probably nearby.", "I have no idea, ask someone else.", "The building has no directions."], topic: "Functional language and interaction", explanation: "The response is transparent about uncertainty and directs the visitor to a reliable source." },
  { stem: "You want to emphasise that a deadline is flexible but still important. What should you write?", correct: "While the date is negotiable, we would appreciate receiving the draft by Friday if possible.", distractors: ["The date is both fixed and irrelevant.", "Send it whenever you feel like it.", "The deadline cannot be discussed under any circumstances."], topic: "Functional language and interaction", explanation: "While introduces a balanced contrast between flexibility and a preferred target." },
  { stem: "You are responding to a complaint and need to acknowledge the problem before explaining the solution. Which opening is best?", correct: "I understand why this has been frustrating, and I am sorry for the inconvenience caused.", distractors: ["The problem is entirely your fault.", "There is no reason to complain.", "You should have read everything more carefully."], topic: "Functional language and interaction", explanation: "The opening recognises the customer's experience and apologises without escalating the situation." },
  { stem: "You want to check that everyone has the same understanding of a decision. Which phrase is suitable?", correct: "Just to make sure we are on the same page, are we postponing the launch until June?", distractors: ["You all understood me, obviously.", "I assume nobody has questions.", "The decision is secret, so do not repeat it."], topic: "Functional language and interaction", explanation: "The phrase checks shared understanding and restates the decision as a clear question." },
  { stem: "You need to explain that one factor is important but not the only one. Which wording is accurate?", correct: "Cost is a significant consideration, but it is not the sole basis for the decision.", distractors: ["Cost is the only thing that matters.", "Cost has no relevance whatsoever.", "The decision cannot involve any considerations."], topic: "Functional language and interaction", explanation: "Significant but not sole communicates relative importance precisely." },
  { stem: "You are asking a lecturer whether a source is acceptable for an assignment. Which email sentence is most appropriate?", correct: "Could you let me know whether this source would be suitable for the assignment?", distractors: ["Is this source okay or not?", "You need to approve this immediately.", "I will use it, so there is no need to reply."], topic: "Functional language and interaction", explanation: "Could you let me know whether is a polite and grammatically complete academic request." },
  { stem: "You want to transition from a problem to a possible solution in a presentation. Which phrase works best?", correct: "With this challenge in mind, the next section considers two possible responses.", distractors: ["Forget the challenge and move on randomly.", "There is no response worth considering.", "The next section repeats the problem without purpose."], topic: "Functional language and interaction", explanation: "With this challenge in mind creates a logical link between the problem and proposed responses." },
  { stem: "You need to tell a colleague that a task is incomplete without sounding accusatory. What should you say?", correct: "The draft is a useful start; could you add the supporting figures before we circulate it?", distractors: ["The draft is careless and unusable.", "You clearly did not try.", "I will replace the whole thing without explanation."], topic: "Functional language and interaction", explanation: "The response recognises progress and states the specific improvement needed." },
  { stem: "You are concluding an argument while acknowledging an alternative view. Which sentence is strongest?", correct: "Although the alternative has some merit, the available evidence favours the proposed approach.", distractors: ["Anyone who disagrees is wrong.", "Evidence is irrelevant to this conclusion.", "There are no alternative views."], topic: "Functional language and interaction", explanation: "Although acknowledges a counterargument before giving a reasoned conclusion." },
  { stem: "You want to invite further questions at the end of a formal talk. Which closing is suitable?", correct: "Thank you for listening. I would be happy to take any questions.", distractors: ["That is all; do not ask anything.", "You should already know the answers.", "Questions would only waste time."], topic: "Functional language and interaction", explanation: "The closing is conventional, polite and clearly opens the floor for questions." },
  { stem: "You need to correct a small factual error in a shared document. What is the most tactful note?", correct: "I think the date in paragraph three may need checking; the source lists it as 2019.", distractors: ["The date is wrong, as usual.", "You have misunderstood the entire document.", "I changed it without telling anyone."], topic: "Functional language and interaction", explanation: "I think and may need checking soften the correction while providing verifiable evidence." },
  { stem: "A meeting has become unfocused. Which phrase best brings the group back to the agreed objective?", correct: "Could we return to the main question and decide which option best meets the project's objective?", distractors: ["This discussion is pointless, so stop talking.", "Choose whichever option you prefer without checking the aim.", "The original objective no longer matters."], topic: "Functional language and interaction", explanation: "The response politely redirects the discussion and links the decision to a shared objective." },
];

/* -------------------------------------------------------------
 * 🌟 新增擴充題型 (New CEFR B2 Question Types):
 * 1. Cloze & Discourse Markers (克漏字與篇章銜接詞)
 * 2. Collocations & Phrasal Verbs (高頻搭配詞與片語)
 * 3. Sentence Transformation & Structure (文法句型置換與倒裝)
 * 4. Workplace & Academic Pragmatics (職場與學術情境溝通)
 * ------------------------------------------------------------*/

const clozeAndDiscourse: Seed[] = [
  {
    stimulus: "Urban planners increasingly favour mixed-use developments over single-purpose residential zones. (1) ___, such projects reduce commuting times and foster vibrant neighbourhood communities; however, they require substantial upfront infrastructure investment.",
    stem: "Choose the connective that best completes blank (1) based on the passage above.",
    correct: "On the one hand",
    distractors: ["In summary", "In spite of", "As a result of"],
    topic: "Cloze and discourse markers",
    explanation: "'On the one hand' sets up a two-sided appraisal that is balanced by 'however' in the second clause.",
  },
  {
    stimulus: "The initial clinical trials showed encouraging results regarding efficacy. (1) ___, several senior researchers raised concerns regarding the small sample size and demographic homogeneity.",
    stem: "Choose the word or phrase that best fits blank (1).",
    correct: "Nevertheless",
    distractors: ["Consequently", "Furthermore", "Namely"],
    topic: "Cloze and discourse markers",
    explanation: "'Nevertheless' signals contrast between the positive initial efficacy results and the researchers' concerns.",
  },
  {
    stimulus: "Renewable energy adoption has accelerated across the continent. (1) ___, reliance on fossil fuel imports has dropped by an unprecedented twelve percent over the past two quarters.",
    stem: "Choose the best transition word for blank (1).",
    correct: "Accordingly",
    distractors: ["Conversely", "Notwithstanding", "Otherwise"],
    topic: "Cloze and discourse markers",
    explanation: "'Accordingly' (or 'Consequently') indicates a logical result following the accelerated adoption of renewables.",
  },
  {
    stimulus: "The corporation updated its remote work policy, granting employees greater autonomy. (1) ___, strict cybersecurity guidelines were introduced to safeguard sensitive client data.",
    stem: "Which linking phrase best fills blank (1)?",
    correct: "Simultaneously",
    distractors: ["Instead", "Whereas", "Unless"],
    topic: "Cloze and discourse markers",
    explanation: "'Simultaneously' indicates that two distinct company measures occurred at the same time.",
  },
  {
    stimulus: "Traditional retail stores face fierce competition from e-commerce platforms. (1) ___, physical outlets that offer personalized in-store experiences have managed to retain loyal customer bases.",
    stem: "Which connector best completes blank (1)?",
    correct: "Even so",
    distractors: ["Besides", "Similarly", "In other words"],
    topic: "Cloze and discourse markers",
    explanation: "'Even so' acts as a concession marker meaning 'despite this competition'.",
  },
  {
    stimulus: "Public health authorities emphasized that the vaccine is safe and effective. (1) ___ should citizens delay seeking immunization unless explicitly advised by a medical professional.",
    stem: "Choose the correct phrase to complete the inverted sentence in blank (1).",
    correct: "Under no circumstances",
    distractors: ["In any case", "At all events", "To some degree"],
    topic: "Cloze and discourse markers",
    explanation: "'Under no circumstances' is a negative adverbial triggering inversion ('should citizens delay').",
  },
  {
    stimulus: "The new automation software was expected to streamline payroll processing. (1) ___, unexpected compatibility glitches with legacy databases caused a two-week delay.",
    stem: "Which transition best fills blank (1)?",
    correct: "In the event",
    distractors: ["As well as", "In addition", "Therefore"],
    topic: "Cloze and discourse markers",
    explanation: "'In the event' (or 'As it turned out') introduces what actually happened contrary to expectations.",
  },
  {
    stimulus: "The university decided to freeze tuition fees for the upcoming academic year, (1) ___ providing emergency hardship bursaries for low-income scholars.",
    stem: "Choose the best phrase to complete blank (1).",
    correct: "in addition to",
    distractors: ["in contrast with", "with regard for", "on behalf of"],
    topic: "Cloze and discourse markers",
    explanation: "'In addition to' is followed by a gerund and introduces an accompanying supportive measure.",
  },
  {
    stimulus: "Online customer support systems utilize artificial intelligence to resolve frequent queries instantly, (1) ___ human representatives are reserved for complex, high-priority issues.",
    stem: "Which word best completes the contrast in blank (1)?",
    correct: "whereas",
    distractors: ["provided", "inasmuch", "unless"],
    topic: "Cloze and discourse markers",
    explanation: "'Whereas' indicates a contrast between AI handling routine queries and humans handling complex ones.",
  },
  {
    stimulus: "The research team gathered extensive quantitative data; (1) ___, they conducted twenty in-depth qualitative interviews to capture nuanced participant experiences.",
    stem: "Choose the most appropriate discourse marker for blank (1).",
    correct: "moreover",
    distractors: ["otherwise", "instead", "conversely"],
    topic: "Cloze and discourse markers",
    explanation: "'Moreover' adds supplementary evidence of a complementary qualitative method.",
  },
  {
    stimulus: "The audit identified minor discrepancies in the quarterly inventory reports. (1) ___, the financial statements were deemed fundamentally accurate.",
    stem: "Which connector fits blank (1)?",
    correct: "All things considered",
    distractors: ["For instance", "In consequence", "Above all"],
    topic: "Cloze and discourse markers",
    explanation: "'All things considered' summarizes the overall verdict after acknowledging minor discrepancies.",
  },
  {
    stimulus: "The city council voted to expand pedestrian zones, (1) ___ environmental sustainability and improved public health as the primary drivers.",
    stem: "Which participial phrase correctly completes blank (1)?",
    correct: "citing",
    distractors: ["to be cited", "having been cited", "cited with"],
    topic: "Cloze and discourse markers",
    explanation: "The present participle 'citing' functions as an adverbial modifier explaining the council's reasoning.",
  },
  {
    stimulus: "Many startup founders concentrate primarily on rapid user acquisition. (1) ___, sustainable profitability should remain the cornerstone of any long-term business strategy.",
    stem: "Which phrase best establishes the contrasting perspective in blank (1)?",
    correct: "Be that as it may",
    distractors: ["As a consequence", "In like manner", "For this purpose"],
    topic: "Cloze and discourse markers",
    explanation: "'Be that as it may' accepts the preceding point while asserting the importance of profitability.",
  },
  {
    stimulus: "The company achieved record-breaking quarterly revenue, (1) ___ reflecting robust international demand for its next-generation clean-tech solutions.",
    stem: "Choose the best adverb for blank (1).",
    correct: "largely",
    distractors: ["barely", "reluctantly", "rigidly"],
    topic: "Cloze and discourse markers",
    explanation: "'Largely' means mostly or chiefly, explaining the primary cause of the record revenue.",
  },
  {
    stimulus: "The software vendor issued a mandatory patch (1) ___ a critical security vulnerability discovered during routine penetration testing.",
    stem: "Which prepositional phrase best fills blank (1)?",
    correct: "in response to",
    distractors: ["in spite of", "in comparison with", "in terms with"],
    topic: "Cloze and discourse markers",
    explanation: "'In response to' indicates the direct triggering event for issuing the security patch.",
  },
  {
    stimulus: "The museum exhibition was widely acclaimed by art critics; (1) ___, public ticket sales surpassed all initial projections within the first fortnight.",
    stem: "Which connective best indicates reinforcement in blank (1)?",
    correct: "what is more",
    distractors: ["on the contrary", "in contrast", "otherwise"],
    topic: "Cloze and discourse markers",
    explanation: "'What is more' introduces an additional positive outcome that reinforces the critical success.",
  },
  {
    stimulus: "The committee agreed that the proposed bylaws would take effect on 1 October, (1) ___ final approval by the governing board at next week's plenary session.",
    stem: "Which conditional phrase best fills blank (1)?",
    correct: "subject to",
    distractors: ["contrary to", "adjacent to", "in preference to"],
    topic: "Cloze and discourse markers",
    explanation: "'Subject to' means conditional upon receiving approval from the board.",
  },
  {
    stimulus: "Agricultural output fell by 8% due to severe drought conditions. (1) ___, consumer food prices experienced upward pressure across all regional markets.",
    stem: "Which transitional word best expresses causality in blank (1)?",
    correct: "Hence",
    distractors: ["Although", "Whereas", "Notwithstanding"],
    topic: "Cloze and discourse markers",
    explanation: "'Hence' (meaning 'for this reason') connects the drop in agricultural output to the rise in prices.",
  },
];

const collocationsAndIdioms: Seed[] = [
  { stem: "When designing the user interface, engineers must take accessibility standards into ___.", correct: "account", distractors: ["regard", "view", "mind"], topic: "Collocations and phrasal verbs", explanation: "'Take into account' (or 'take into consideration') is a standard collocation meaning to consider." },
  { stem: "The latest archaeological discovery has shed new ___ on ancient maritime trade routes.", correct: "light", distractors: ["vision", "insight", "focus"], topic: "Collocations and phrasal verbs", explanation: "'Shed light on' is an idiomatic expression meaning to provide clarifying information about something." },
  { stem: "The success of the renewable energy initiative will largely ___ on public participation.", correct: "hinge", distractors: ["attach", "bind", "fasten"], topic: "Collocations and phrasal verbs", explanation: "'Hinge on' means to depend entirely on something." },
  { stem: "The government pledged to ___ down on fraudulent online advertising schemes.", correct: "clamp", distractors: ["strike", "press", "force"], topic: "Collocations and phrasal verbs", explanation: "'Clamp down on' means to act strictly to prevent illegal or harmful activity." },
  { stem: "Her groundbreaking research in neural networks paved the ___ for modern conversational AI.", correct: "way", distractors: ["road", "path", "track"], topic: "Collocations and phrasal verbs", explanation: "'Pave the way for' is a standard idiom meaning to create conditions for future developments." },
  { stem: "The company had to ___ the consequences of neglecting system maintenance for years.", correct: "face", distractors: ["look", "head", "meet"], topic: "Collocations and phrasal verbs", explanation: "'Face the consequences' means to accept and deal with the unpleasant outcome of actions." },
  { stem: "Senior management agreed to give the green ___ to the innovative carbon-capture project.", correct: "light", distractors: ["flag", "sign", "mark"], topic: "Collocations and phrasal verbs", explanation: "'Give the green light' means to grant official permission for a project to proceed." },
  { stem: "Rising supply chain costs have eaten ___ the firm's quarterly operating profit margins.", correct: "into", distractors: ["away", "upon", "down"], topic: "Collocations and phrasal verbs", explanation: "'Eat into' is a phrasal verb meaning to use up or reduce a part of something valuable." },
  { stem: "The lead architect made a point of ___ the client's preferences into the blueprint.", correct: "incorporating", distractors: ["accumulating", "implicating", "substituting"], topic: "Collocations and phrasal verbs", explanation: "'Incorporate something into' means to include or blend something as part of a whole." },
  { stem: "Before finalizing the contract, both legal teams need to iron ___ the remaining ambiguities.", correct: "out", distractors: ["up", "off", "through"], topic: "Collocations and phrasal verbs", explanation: "'Iron out' means to resolve or eliminate minor difficulties or differences." },
  { stem: "The new electric vehicle model has lived ___ to its reputation for outstanding efficiency.", correct: "up", distractors: ["on", "out", "by"], topic: "Collocations and phrasal verbs", explanation: "'Live up to' means to match expectations or standards." },
  { stem: "The director's sudden resignation came as a bolt from the ___, stunning the board.", correct: "blue", distractors: ["dark", "sky", "storm"], topic: "Collocations and phrasal verbs", explanation: "'A bolt from the blue' is an idiom describing a complete, unexpected surprise." },
  { stem: "In academic writing, scholars must avoid drawing conclusions that are not ___ up by evidence.", correct: "backed", distractors: ["stood", "held", "lifted"], topic: "Collocations and phrasal verbs", explanation: "'Backed up by' means supported or substantiated by facts or data." },
  { stem: "The project was carried ___ in strict adherence to international safety protocols.", correct: "out", distractors: ["on", "over", "through"], topic: "Collocations and phrasal verbs", explanation: "'Carry out' means to perform, conduct, or execute an activity." },
  { stem: "The team worked around the ___ to restore database connectivity before business hours.", correct: "clock", distractors: ["hour", "time", "watch"], topic: "Collocations and phrasal verbs", explanation: "'Work around the clock' means to work continuously day and night without stopping." },
  { stem: "His extensive background in machine learning makes him an asset beyond ___ to our team.", correct: "measure", distractors: ["count", "scale", "bound"], topic: "Collocations and phrasal verbs", explanation: "'Beyond measure' is a formal collocation meaning extremely great in extent or value." },
  { stem: "The committee has yet to come to ___ with the long-term implications of the ruling.", correct: "terms", distractors: ["words", "minds", "views"], topic: "Collocations and phrasal verbs", explanation: "'Come to terms with' means to accept and deal with a challenging situation." },
  { stem: "Effective mentors know when to step ___ and let junior colleagues take the lead.", correct: "back", distractors: ["down", "away", "out"], topic: "Collocations and phrasal verbs", explanation: "'Step back' means to withdraw slightly to allow others space or perspective." },
];

const sentenceTransformations: Seed[] = [
  { stem: "Rewrite: 'We rarely see such dedication in young researchers.' → 'Rarely ___ such dedication in young researchers.'", correct: "do we see", distractors: ["we see", "we have seen", "did we saw"], topic: "Sentence transformation and structure", explanation: "Initial negative adverbial 'Rarely' requires present simple inversion: 'do we see'." },
  { stem: "Rewrite: 'If you should require further assistance, please contact our helpdesk.' → '___ you require further assistance, please contact our helpdesk.'", correct: "Should", distractors: ["Were", "Had", "Unless"], topic: "Sentence transformation and structure", explanation: "Inversion for conditional 'If you should...' drops 'if' and begins with auxiliary 'Should'." },
  { stem: "Rewrite: 'The team only discovered the error after running the third simulation.' → 'It was not until the third simulation was run ___ the error was discovered.'", correct: "that", distractors: ["when", "then", "which"], topic: "Sentence transformation and structure", explanation: "The cleft pattern 'It was not until X that Y' requires 'that' to introduce the main clause." },
  { stem: "Rewrite: 'Although she was inexperienced, she handled the crisis remarkably well.' → 'Inexperienced ___ she was, she handled the crisis remarkably well.'", correct: "though", distractors: ["despite", "even", "however"], topic: "Sentence transformation and structure", explanation: "Adjective + though/as + subject + verb is an inverted concessive construction." },
  { stem: "Rewrite: 'They did not realize how serious the data breach was.' → 'Little ___ how serious the data breach was.'", correct: "did they realize", distractors: ["they realized", "they had realized", "do they realize"], topic: "Sentence transformation and structure", explanation: "Negative adverbial 'Little' at sentence start triggers past inversion 'did they realize'." },
  { stem: "Rewrite: 'The bridge collapsed because the foundation was weak.' → 'Had the foundation not been weak, the bridge ___.'", correct: "would not have collapsed", distractors: ["will not collapse", "did not collapse", "would not collapse"], topic: "Sentence transformation and structure", explanation: "Third conditional inverted clause ('Had the foundation not been...') takes 'would not have + V-en'." },
  { stem: "Rewrite: 'You must not disclose the password to anyone under any circumstances.' → 'Under no circumstances ___ the password to anyone.'", correct: "must you disclose", distractors: ["you must disclose", "you should to disclose", "must disclose you"], topic: "Sentence transformation and structure", explanation: "'Under no circumstances' triggers modal inversion: 'must you disclose'." },
  { stem: "Rewrite: 'She solved the algorithm and also documented the entire codebase.' → 'Not only ___ the algorithm, but she also documented the codebase.'", correct: "did she solve", distractors: ["she solved", "she was solving", "had she solved"], topic: "Sentence transformation and structure", explanation: "'Not only' at the beginning triggers auxiliary inversion 'did she solve'." },
  { stem: "Rewrite: 'I would prefer you not to mention this matter during the meeting.' → 'I would rather you ___ this matter during the meeting.'", correct: "did not mention", distractors: ["do not mention", "not to mention", "not mentioning"], topic: "Sentence transformation and structure", explanation: "'Would rather + subject' takes past subjunctive ('did not mention') for present/future preferences." },
  { stem: "Rewrite: 'The manager hired a consultant to audit the accounts.' → 'The manager had the accounts ___ by a consultant.'", correct: "audited", distractors: ["auditing", "to audit", "been audited"], topic: "Sentence transformation and structure", explanation: "Causative structure: have + object + past participle ('had the accounts audited')." },
  { stem: "Rewrite: 'It is expected that the committee will release its verdict tomorrow.' → 'The committee is expected ___ its verdict tomorrow.'", correct: "to release", distractors: ["releasing", "release", "to have released"], topic: "Sentence transformation and structure", explanation: "Passive reporting transformation converts 'It is expected that S + V' to 'S is expected to V'." },
  { stem: "Rewrite: 'The moment the speaker finished, the audience gave a standing ovation.' → 'Scarcely had the speaker finished ___ the audience applauded.'", correct: "when", distractors: ["than", "that", "then"], topic: "Sentence transformation and structure", explanation: "'Scarcely... when' and 'Hardly... when' are paired correlatives (contrasting with 'No sooner... than')." },
  { stem: "Rewrite: 'He regrets not accepting the fellowship in Zurich.' → 'He wishes he ___ the fellowship in Zurich.'", correct: "had accepted", distractors: ["accepted", "would accept", "has accepted"], topic: "Sentence transformation and structure", explanation: "Past regrets with 'wish' require the past perfect tense: 'had accepted'." },
  { stem: "Rewrite: 'We will approve the budget only if all receipts are submitted.' → 'Only if all receipts are submitted ___ the budget.'", correct: "will we approve", distractors: ["we will approve", "we approve", "do we approve"], topic: "Sentence transformation and structure", explanation: "'Only if...' at the start requires inversion in the main clause: 'will we approve'." },
  { stem: "Rewrite: 'Someone should have notified the clients earlier.' → 'The clients ought ___ earlier.'", correct: "to have been notified", distractors: ["to notify", "having notified", "to be notified"], topic: "Sentence transformation and structure", explanation: "'Ought to have been + V-en' expresses an unfulfilled past passive obligation." },
  { stem: "Rewrite: 'What amazed the judges was her poise under intense questioning.' → 'It was her poise under intense questioning ___ the judges.'", correct: "that amazed", distractors: ["which it amazed", "what amazed", "whom amazed"], topic: "Sentence transformation and structure", explanation: "It-cleft sentence formula: It + is/was + focus + that/who + rest of clause." },
  { stem: "Rewrite: 'As soon as we arrived at the venue, the rehearsal began.' → 'No sooner had we arrived at the venue ___ the rehearsal began.'", correct: "than", distractors: ["when", "then", "that"], topic: "Sentence transformation and structure", explanation: "'No sooner had... than...' is the exact correlative structure for immediate succession." },
  { stem: "Rewrite: 'The technician said, “I didn't alter any default configuration settings.”' → 'The technician denied ___ any default settings.'", correct: "having altered", distractors: ["to alter", "to have altered", "alter"], topic: "Sentence transformation and structure", explanation: "'Deny' takes gerund or perfect gerund ('having altered') in reported speech." },
];

const appliedPragmatics: Seed[] = [
  { stem: "In a formal business email, how should you politely nudge a vendor who has missed a delivery deadline?", correct: "Could you kindly provide an updated estimated delivery date for our purchase order #402?", distractors: ["Why is our order late again?", "Deliver the order right now or cancel it.", "I assume you have forgotten about our order."], topic: "Applied situational pragmatics", explanation: "Polite, professional inquiry requesting a concrete update without aggressive accusatory tone." },
  { stem: "During a cross-functional sprint review, you need to diplomatically suggest that a teammate's estimation is overly optimistic. What should you say?", correct: "While the timeline is ambitious, we might want to factor in potential QA testing bottlenecks.", distractors: ["That deadline is completely unrealistic and impossible.", "You clearly have no idea how long QA takes.", "Let's just give up on meeting this deadline."], topic: "Applied situational pragmatics", explanation: "Constructive hedging ('While...', 'we might want to factor in...') highlights risk without attacking." },
  { stem: "You are moderating a panel discussion and need to gracefully interrupt a speaker who has exceeded their time limit. What is best?", correct: "Thank you for those insightful remarks; in the interest of time, let's now hear from Dr. Chen.", distractors: ["Stop talking, your time was up two minutes ago.", "Be quiet so the next person can speak.", "I am cutting your microphone now."], topic: "Applied situational pragmatics", explanation: "Validates the speaker's contribution while using 'in the interest of time' to transition smoothly." },
  { stem: "You receive an ambiguous task description from your manager. How should you ask for clarification without appearing incompetent?", correct: "To ensure alignment with project goals, could we briefly confirm the primary deliverables for this phase?", distractors: ["I don't understand anything you wrote here.", "You didn't explain the task properly.", "Should I just guess what you want me to do?"], topic: "Applied situational pragmatics", explanation: "Frames the request around 'ensuring alignment with project goals' which sounds proactive." },
  { stem: "How do you deliver constructive critical feedback on a peer's draft report in a collaborative workplace?", correct: "The literature review is comprehensive; tightening the methodology section would strengthen the overall argument.", distractors: ["Your methodology section is poorly written.", "Delete the methodology and start over.", "Everything is fine, don't change anything."], topic: "Applied situational pragmatics", explanation: "Balances praise for strong parts with specific, actionable suggestions for improvement." },
  { stem: "In an academic seminar, how do you express polite disagreement with a presenter's statistical interpretation?", correct: "I find your hypothesis compelling; however, could the variance be partially accounted for by demographic outliers?", distractors: ["Your statistics are clearly flawed and invalid.", "Nobody uses that statistical test anymore.", "I completely disagree with everything you said."], topic: "Applied situational pragmatics", explanation: "Acknowledges the hypothesis before introducing an alternative variable for consideration." },
  { stem: "A client requests a major feature addition outside the agreed project scope. How do you respond professionally?", correct: "We would be delighted to incorporate this feature; I will prepare a separate addendum detailing the timeline and cost adjustments.", distractors: ["No, that is not in the contract.", "You can't just add features whenever you want.", "We will do it for free just to keep you happy."], topic: "Applied situational pragmatics", explanation: "Welcoming the request while clearly linking out-of-scope work to formal contract addenda and pricing." },
  { stem: "You are leading a conference call where two participants are talking over each other. How should you intervene?", correct: "Let's hear Mark's point first, and then we'll immediately turn to Sarah for her perspective.", distractors: ["Both of you stop arguing immediately.", "Mute yourselves until I tell you to speak.", "Whoever speaks loudest can continue."], topic: "Applied situational pragmatics", explanation: "Establishes structured turn-taking calmly and impartially." },
  { stem: "You need to decline a high-priority meeting because you are giving a keynote presentation at the same time. What should you write?", correct: "Regrettably, I have an immovable speaking engagement at that hour, but I will review the minutes and share my feedback asynchronously.", distractors: ["I am way too busy with important things to attend.", "Don't schedule meetings when I have presentations.", "I won't be there, so do whatever you want."], topic: "Applied situational pragmatics", explanation: "Explains the genuine conflict politely and offers an asynchronous contribution." },
  { stem: "How should an author respond to a peer reviewer's harsh critique in an academic journal revision letter?", correct: "We appreciate the reviewer's rigorous assessment and have revised Section 3 to clarify the experimental constraints.", distractors: ["The reviewer clearly failed to read our paper carefully.", "We reject this critique because it is unfair.", "We changed it, though the reviewer is mistaken."], topic: "Applied situational pragmatics", explanation: "Professional scholarly tone that maintains objectivity and highlights constructive revisions." },
  { stem: "You need to apologize to a client for an inadvertent software outage without damaging the company's credibility. What is best?", correct: "We sincerely apologize for the disruption caused. Our engineering team has resolved the root cause and implemented redundant safeguards.", distractors: ["It wasn't our fault; the cloud provider had an outage.", "Outages happen all the time in software, so please bear with us.", "We are sorry and hope you won't sue us."], topic: "Applied situational pragmatics", explanation: "Acknowledges responsibility, states the fix, and reassures with future preventive safeguards." },
  { stem: "In an interview, how do you discuss a previous professional failure constructively?", correct: "The campaign fell short of its target, which taught our team the critical importance of early user testing before wide deployment.", distractors: ["The failure was entirely due to my former manager's incompetence.", "I have never failed in any project I worked on.", "It was a disaster and I try not to think about it."], topic: "Applied situational pragmatics", explanation: "Focuses on accountability, reflection, and transferable lessons learned." },
  { stem: "You want to invite an external industry expert to deliver a guest lecture to your team. How do you open your invitation?", correct: "Given your renowned expertise in data governance, our engineering group would be deeply honored if you could share your insights in a 30-minute virtual session.", distractors: ["Can you give us a free speech next Tuesday?", "We need someone to talk about data governance, so please come.", "Let me know if you are free to do a presentation for us."], topic: "Applied situational pragmatics", explanation: "Complimentary, specific regarding topic and time commitment, and formally respectful." },
  { stem: "A colleague takes credit for a presentation deck you primarily created. How should you address this in private?", correct: "I noticed my contributions weren't highlighted during today's presentation; moving forward, let's ensure co-authorship is clearly acknowledged.", distractors: ["You stole my work and took all the credit!", "I will report you to HR immediately for plagiarism.", "I guess I shouldn't bother helping you next time."], topic: "Applied situational pragmatics", explanation: "Direct and assertive in private, focused on future alignment and fairness without toxic escalation." },
  { stem: "How do you close a formal negotiation email when awaiting the other party's counter-proposal?", correct: "We look forward to reviewing your counter-proposal and remain confident we can reach a mutually advantageous agreement.", distractors: ["Send your offer quickly or we walk away.", "Hopefully you won't disappoint us with your numbers.", "We wait for your message."], topic: "Applied situational pragmatics", explanation: "Positive, collaborative tone emphasizing mutual benefit." },
  { stem: "You need to prompt meeting participants to wrap up their discussion as the allocated room booking is ending. What should you say?", correct: "As we have five minutes remaining in this room, let's summarize our action items and assigned owners.", distractors: ["Pack up your laptops; we are getting kicked out.", "Stop discussing now, time is up.", "Leave immediately."], topic: "Applied situational pragmatics", explanation: "Productively steers the final minutes toward concrete takeaways and accountability." },
  { stem: "How should a team leader announce an unexpected organizational restructuring to reduce team anxiety?", correct: "While organizational changes can feel unsettling, our core project priorities remain intact, and I will hold open 1-on-1 sessions this week to address all questions.", distractors: ["Everything is changing and some people might lose jobs, so good luck.", "Don't ask questions about the restructure because I don't know either.", "Nothing matters anymore so just keep working."], topic: "Applied situational pragmatics", explanation: "Empathetic, transparent, reassuring about core mission, and establishes direct communication channels." },
  { stem: "In a formal debate, how do you transition to rebutting the opposing side's argument?", correct: "While our colleagues raise a valid point regarding initial capital outlay, their analysis overlooks long-term lifecycle savings.", distractors: ["The other side is totally wrong about everything they just said.", "That point makes no sense whatsoever.", "Forget what they said and listen to me."], topic: "Applied situational pragmatics", explanation: "Acknowledges the validity of part of the opposing argument before introducing the counter-evidence." },
];

export const ENGLISH_B2_QUESTIONS: Question[] = [
  ...makeQuestions("VOC", vocabulary, "基礎"),
  ...makeQuestions("GRAM", grammar, "進階"),
  ...makeQuestions("READ", reading, "情境"),
  ...makeQuestions("FUNC", functional, "情境"),
  ...makeQuestions("CLOZE", clozeAndDiscourse, "進階"),
  ...makeQuestions("COLLOC", collocationsAndIdioms, "基礎"),
  ...makeQuestions("TRANS", sentenceTransformations, "進階"),
  ...makeQuestions("PRAG", appliedPragmatics, "情境"),
];
