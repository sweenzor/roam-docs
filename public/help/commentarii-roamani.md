# Commentarii Roamani

#### Hello Again, Roamans -- [[April 5th, 2025]]

- 
  Roam is for people who think in outlines, jump between tabs, and write things down before they make sense.
- It’s not just for storing what you know but it’s for exploring what you don’t.
- ​
- When you rely on a tool like that, silence feels heavy.
- Lately, it’s been quiet and __that’s on us. __We haven’t stopped building, we only stopped communicating.

- Here’s what we’re planning to remedy that:
  - The newsletter is back. Every two weeks, you’ll get product updates, workflows, tutorials, ideas worth trying, and the occasional glimpse into how the others are thinking with Roam
  - Updates won’t be buried. When we ship something, you’ll know. When something breaks, we’ll say it.
  - You’ll see what’s in progress: the rough edges, the sketches, and the stuff we’re still figuring out.
  - We’ll ask for your input and actually use it. Every issue will include a space to share feedback, requests, insights, etc.
- Roam should grow with you, not hit puberty and stop texting back.

- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/6qBBL9SmwnndRbA2GBUS4w/email)

- Now here’s a quick roundup of what’s landed in the last few months:

- 🧠 New in Roam
  - ​[Diagram Redesign:](https://x.com/RoamResearch/status/1795920562826387833) Complete overhaul: fully redesigned for smoother arrows, cleaner styling, and a more intuitive layout
  - ​[Zen Mode:](https://x.com/RoamResearch/status/1893889010201694693) new distraction-free writing environment that hides all sidebars and toolbars, so that you can focus solely on your content
  - ​[Graph History:](https://x.com/RoamResearch/status/1841715046767890511) Travel back to any point in time to view past versions of your graph or recover accidentally deleted notes.
  - ​[Cross-Graph Search:](https://x.com/RoamResearch/status/1783894268781777160) Quickly find and open content across all your graphs using `Cmd+Shift+U` (`Ctrl+Shift+U` on Windows)
  - ​[Zapier Integration (Beta):](https://x.com/RoamResearch/status/1838987255710626154) Send starred emails, saved Slack messages, and more – directly into your Roam graph
  - Query Nouveautés:
    - ​[Query Builder](https://x.com/RoamResearch/status/1895176281601515943) supports combining multiple `{search:}` blocks with AND/OR/NOT logic and nested filters, using a simple visual interface instead of manual syntax
    - Search for plain text inside your queries using `{search:}` and combine multiple searches to filter across different parts of a block, [see thread](https://x.com/RoamResearch/status/1862950982541611181)​
    - Query titles!
    - `:q` inline query revamp with cleaner styling and improved template behavior, more details in [this thread](https://x.com/RoamResearch/status/1905657513699328335)​
    - Ability to query for blocks `created-by:` or `edited-by:` any user, [see here](https://x.com/RoamResearch/status/1892483213794390097)​
- ​
- 🌿 Quality of Life Improvements
  - ​[Performance Improvements:](https://x.com/RoamResearch/status/1893013088451821903) Encrypted graphs now load up to 5× faster, with filters and linked references also seeing general speed boosts.
  - ​[Biometric Unlock on Mobile:](https://x.com/RoamResearch/status/1871275016932688291) Use Face ID or fingerprint to unlock encrypted graphs
  - ​[Graph Size Metrics](https://x.com/RoamResearch/status/1887918594803056847): The Graph Settings tab now shows page count, block count and total graph size
  - ​[Deep Linking:](https://x.com/RoamResearch/status/1868437329452617743) Roam links now open directly in the mobile app from outside sources
  - ​[MessagePack Export:](https://x.com/RoamResearch/status/1833301962109960390) Export your graph in .msgpack: ~4× faster, ~10× less memory, and 30% smaller files than EDN
  - ​[Download All Files:](https://x.com/RoamResearch/status/1887918588733902884) download all uploaded files from your graph in the File manager
  - ​[Switch Out Daily References:](https://x.com/RoamResearch/status/1801581669666713809) Alt-click (or Opt-click) any daily note link to quickly reschedule it
  - ​[Pin to top Sidebar:](https://x.com/RoamResearch/status/1804148729617785076) Long-press the pin icon to lock a sidebar tab in place, new windows will now open below it.
  - ​[Mermaid Diagram Improvements:](https://roamresearch.com/#/app/help/page/nzZgnkbII) Cleaner visuals, theme control, and expanded diagram types including Gantt charts, sankey and sequence diagrams.
- ​
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/xw86UadZ5G8ANb9d7vUM4P/email)

- You’re receiving this because you’re part of the Roam community. You signed up, used the app, or crossed paths with us somewhere along the way. We want to share things that spark curiosity and help you think better. If that’s not quite what you’re looking for, feel free to ​[unsubscribe](https://preview.convertkit-mail2.com/unsubscribe). And if something’s on your mind, a thought, a wish, an idea, you can share it with us [here](https://forms.gle/rMjPJXinQDfw8F5NA). We’d love to hear from you!

#### Commentarii Roamani: Updates, a Simple Workflow, and Community Spotlight -- [[April 19th, 2025]]

### 📣 __What’s New __📣

- Roam is faster: Pages with complex queries, large sidebars, or long chains of linked references open with less friction, making the entire graph feel lighter and more responsive even when you’re working across several contexts at once.
- Small improvement to the Append API: It supports nested blocks with preserved structure, so indented content flows into your graph exactly as written. This makes tools like Speak to Roam more useful, and works just as well with Zapier, Shortcuts, or any custom setup.

### 🧠 __Workflow: Lightweight CRM in Roam __🧠

- CRM (Customer Relationship Management) sounds like something you need a whole system for. You meet people at events, shows, on calls, or through shared projects, and you want a simple way to remember who they are, what you talked about, and when to follow up. This little setup lives in your graph, slips into your notes without fuss, and just makes that part of life a bit easier to keep up with.
- The idea is simple:
  - Meetings/hangouts get logged in your Daily Notes
  - People have their own pages for long-term details
  - Templates keep everything consistent
  - Queries help you stay on top of follow-ups
- A few examples of attributes you can add to your `[[roam/templates]]`
- {{[[table]]}}
  - Meeting Attributes (used in Daily Notes)

    - `crm/contact::`
      `crm/date::`
      `crm/summary::`
      `crm/next followup::`
      `crm/outcome::`
      `crm/channel::`
      `crm/topic::`
      `crm/owner::`
      `crm/duration::`
      `crm/tags::`
  - Contact Attributes (used for person's page)
    - `crm/first met::`
      `crm/company::`
      `crm/email::`
      `crm/phone::`
      `crm/location::`
      `crm/time zone::`
      `crm/socials::`
      `crm/tags::`
      `crm/source::`
      `crm/notes::`
- Here's what it looks like populated:
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/hAyc3pPuVDCUZ9ojSshgRM/email) 
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FC3lUup-BP9.png?alt=media&token=155030a2-1e10-4557-9fc7-bb67465ea08b) ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FINIiGHr8Pe.png?alt=media&token=609229db-d9f3-4589-be55-b4f638451507)
- With this system, you can use queries to track meetings, walks, work sessions, etc., across your graph:
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FMMCLa3qDwb.png?alt=media&token=aafa6888-b5c6-411f-b27c-1a4362a34b27)
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2F07Nh2u-uMN.png?alt=media&token=6f0c5fb7-0cf2-476c-9702-204833b2dd9b)
  - also track hangouts with a specific person ⬇️
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2F5r-_7tjF-R.png?alt=media&token=995c9f23-68ea-4501-acc6-8cf2939781c1)
  - 

### 🌟 __Community Spotlight: new Roam Depot extensions!____ __🌟

- ​[Card Theme:](https://github.com/qcrao/card-theme) This sleek extension styles your notes by type: fleeting, literature, permanent (and more) using block tags like `#F-Note` or `#Z-Note`. It's a clean way to bring visual structure to your graph effortlessly.
- ​[Ask Perplexity:](https://roamresearch.com/#/app/help/page/gT3R3AY0s) It pulls in answers from Perplexity’s search engine directly into your graph. You type a question, get a clean answer with sources, and follow up right inside Roam. It’s especially useful for quick research, filling in gaps, or exploring unfamiliar topics without switching tabs.
- __​__
- 🐣 Keep on Roaming 🐇
- ​
- ​[Read this online](https://roam-research.kit.com/posts/commentarii-roamani-updates-a-simple-workflow-and-community-spotlight?_gl=1*1hegr2l*_gcl_au*NDM3MzE5MDY5LjE3NDMyODk3MzI.)

#### Commentarii Roamani: Pages Worth Building, [[Experiments]] -- [[May 3rd, 2025]]

- In today's newsletter, we're starting a series: Pages Worth Building. We'll present you with ideas and flows for Roam structures that can work as more permanent scaffolding for your thinking.
- Think pages that track patterns, hold shape-shifting ideas over time, or train a skill – which don't fit into tasks or outlines. For now, we have in mind: [[Experiments]], [[Momentum Log]], [[Reading Index]], [[Mission Control]], and more. If you’ve built something similar, or something completely different that’s earned a place in your graph, feel free to message us on Slack. We’d love to see what you’re working on!
- Let's start with [[Experiments]]
- ---

### 🧪 Pages Worth Building: [[Experiments]]

#### ✨ Why [[Experiments]] Deserves Its Own Page:

- It’s helpful to have a place where you can track what you’re trying.
- Not long-term goals or big changes, just something you’re adjusting to see what happens.
- This page holds the details: what you did, when you did it, and what you noticed. It’s simple, but it’s the kind of page you’ll keep coming back to.

#### 🧠 What Counts as an Experiment?

- Anything you’re trying on purpose to see how it affects something else. The key feature is that you can think ahead of evidence that would confirm or falsify your idea going into the experimentation. You want to check that the causality works (even loosely, by your own measures).
- It could be a change in routine, a new way of organizing your day, a shift in how you approach a task, or a habit you’re testing. It doesn’t need to be formal. It just needs to be specific enough that you can look back and notice what changed.
- Some examples:
  - No screens 1h before bed ➔ does sleep quality change?
  - A timed ten-minute journaling session ➔ does it help you complete more tasks?
  - Batch meetings on one day ➔ does it free up creative flow?
  - No caffeine after 2pm ➔ do you feel more steady through the day?
- The format can be flexible to fit behavior changes, workflow adjustments, substitutions, exploring assumptions/beliefs, etc.

#### 🔧 How to Structure It in Roam

- **🗂 Main Page: [[Experiments]]**
  - This is your master index. You list what you're testing and what you've already tried:
    - `Experiment:: [[Morning Phone Ban]]`
    - `Experiment:: [[Voice Memos After Training]]`
    - `Experiment:: [[Two-Tab Limit]]`
  - Use tags like: `#Active - #Archived - Status:: - Category:: - etc.`
- **📄 Inside Each Experiment Block:**
  - Each experiment starts as a single block on the [[Experiments]] page. The goal is to capture what you’re trying, how you're doing it, and what comes out of it. Keep the structure simple so it's easy to update.
  - Here’s an example:
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FSM8g9Q77vN.png?alt=media&token=6e44c2c2-0e64-4b81-ae0a-540a438d7b00) ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FNdggc1fgXF.png?alt=media&token=953b9d53-9bcb-4ed1-8c9e-181e3db3e018)
    - 
  - Track logs directly in Daily Notes: if you mention an experiment in your daily notes, tag it:
  - ​`Experiments:: [[Morning Phone Ban]]`
  - It will show up in your [[Experiments]] references because of the linked attribute.You can then link the block back into the log later, or leave it where it is, at the bottom of the page.

#### 🧬 Optional Fields & Features

- Your practice can become fairly thorough and deliberate, check these fields out:
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/7TBPy6w16PZk59atAmTYUM/email)
- Once you’ve run a few experiments, certain patterns may show up and the page can bring you a lot of value.
- [[Experiments]] becomes a reference page that will surface what tends to work, what falls apart, and what’s worth trying again – *for you*, in well defined contexts. Instead of relying on memory, you’ll have a record you can look back on.
- ---
- Let us know what you think about this series and look out for our next issue of the newsletter for more updates, community spotlights, and Roam-native powerhouse tools.

#### Commentarii Roamani: Pages Worth Building, [[Via Negativa]] -- [[May 18th, 2025]]

- **🌱 Quality of Life Improvements**
  - Search now supports accented characters automatically. You no longer need to include the accent when searching – "etude" will find "étude"
  - You can now use /embed-children and /embed-path to quickly insert embedded content
  - Inline autocomplete (for things like (( )) and [[ ]] ) now scrolls more smoothly to keep the selected item visible while typing
- **🐞 Fixes**
  - Empty page cleanup now delayed by 48h to avoid orphan blocks
  - Fixed duplicate page creation during Import when titles included accented characters
- ---

### 📮Pages Worth Building: [[Via Negativa]]

- Some pages hold everything you’re working on.
- This one holds everything you’re not.
- > Via negativa (acting by removing) is more powerful and less error-prone than via positiva (acting by addition).​
  - — __Skin in the Game__, Nassim Nicholas Taleb
- Instead of trying to add more productive habits, start eliminating unproductive ones. To achieve happiness, look at what is causing you unhappiness, do not seek new sources of joy. The same logic applies to projects, habits, goals: consider asking which current commitments are draining your time, energy, or focus.

#### 🔩 Setting up the page in Roam

- If you're dropping a skill, log it. If a project feels dead, move it here. If you said No to something this week, write that down. You’re documenting what's no longer worth your time.
- The structure is simple: What? Why? When?
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FzQwboU0eKc.png?alt=media&token=5bdc84c5-fc4a-48e6-9f34-f67e3f157ba5)
- Once you’ve removed something (a habit, a project, a goal) you file it under one of three categories:
  - Dropped Habits: for recurring actions or routines that clutter your time (and that you've decided to stop)​
  - Dropped Projects: for larger efforts you’re no longer working on (if a project already has its own page, reference the page directly)​
  - Dropped Goals: for intentions you’re no longer pursuing. These are especially important to log, since goals tend to linger in the background and quietly drain attention unless they're explicitly abandoned
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FAEsymmcOuu.png?alt=media&token=33273d1c-d422-4632-b5a4-a0057e5b0201)
- You could also include a daily negation query in your page -- to collect small, situational No's you jot down in your Daily Notes as they happen. Tag them with e.g. #refusal (or any tag you prefer), then pull them into a query.
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2F4QkFZ5xUnv.png?alt=media&token=9111c524-a05a-431e-865d-78461debc09d)
- It will feel good to cut what doesn't work: with [[Via Negativa]] you'll have a quiet place to let things go, and peace of mind knowing that they're gone for a reason that made sense to you.
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2Fyur6DRGVBG.png?alt=media&token=77abd567-4147-4434-9c46-a75c00f15599)

#### Commentarii Roamani: Pages/Systems Worth Building, Learning using [[Roam Depot]] -- [[May 31st, 2025]]

- We continue our series Pages/Systems Worth Building, shifting focus from isolated pages to full systems that help your Roam graph grow more powerful day to day.
- This issue is useful for students, but also for any learners who are serious about mastering what they study. We’ll show you how to combine a couple of Roam Depot extensions into a study workflow that uses AI to leverage spaced repetition for learning.
- ---

### 🌀 Systems Worth Building: [[Learnloop]]

- Studying with AI lets you ask questions, go deeper, and clear up confusion. Add spaced repetition and you get the [[Learnloop]]: a system for understanding __and__ remembering, to prevent forgetting at an exponential decay rate. From [Gwern's post on spaced repetition](https://gwern.net/spaced-repetition):
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FL9h8DmOGVC.png?alt=media&token=a96a3e58-5dba-426c-aae1-a08ea8a9343b)

#### 🧰 The Tools

- To install an extension, go to the left sidebar, and open Roam Depot. Search for the extension and click__ Install __(see all the details in the video below). Each extension comes with a description from its creator. For this workflow we used:
  - ​[Memo](https://github.com/digitalmaster/roam-memo) by [Jose Browne](https://x.com/JoseBrowneX): to turn any block into a spaced repetition card.
  - ​[Live AI](https://github.com/fbgallet/roam-extension-live-ai-assistant) by [Fabrice Gallet](https://x.com/fbgallet): to have an AI assistant right inside Roam.

#### 🧱 (optional) Structure for your Notes

- Each large topic gets its own page, with subtopics and subcategories linked inside.
- Within those, you can create individual note pages: one per concept, idea, or question (think [[Permanent Notes]]!). This keeps your graph navigable, layered and atomized.
- For example, in a page like [[Philosophy]], you might link to [[Aristotle]], then to [[The Four Causes]] – a permanent note.
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FUPhj_fqvxB.png?alt=media&token=f7d2235c-2458-4f4f-9ee6-59150b36abcb)
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FDIFDrZOtJL.png?alt=media&token=d147407c-a450-4afa-9830-7b119bd351b6)

#### 🌊 The Workflow

- Here is a simple two-part workflow for taking and studying notes:
   {{[[video]]: https://www.youtube.com/watch?v=kjTQOgLQTo8}}
- 

- **Part I: [[Flashcards]]**
  - While reviewing notes, use Live AI to generate flashcards by writing a prompt, selecting it, and clicking the ⚡️ icon. Once the AI suggests questions, format them as flashcards: tag the question block with #memo, and indent the answer underneath.
  - To review, open the Memo extension from the left sidebar and click __Review__. Rate your recall and Memo will handle the scheduling by bringing due cards back to your sidebar automatically (very neatly color-coded).
- **Part II: [[Exploration]]**
  - Take your conversations with the AI assistant right under the [[Exploration]] block in the permanent note you're studying. Use it to enrich your notes, ask questions, test your understanding, or follow threads of curiosity, by typing or using your voice (!). It’s a lightweight way to explore ideas while staying in context and neatly tracking tangents you go on.
  - This balance between review and curiosity makes your notes active: part memory system, part thinking partner, all without leaving Roam 🏠
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FeSK6h63a43.png?alt=media&token=7eed37d1-1f48-4277-9e6a-e020fc398852)

#### Commentarii Roamani: Pages/Systems Worth Building, The [[Daily 5]] -- [[June 14th, 2025]]

- We’re continuing our series: Pages/Systems Worth Building with a system for anyone who wants to bring more clarity, structure, and intention into their day.
- ---

### Systems Worth Building: The [[Daily 5]]

- This is a five-part daily routine built in Roam: a simple template for reviewing your tasks, planning your time, logging your day, reflecting, and capturing anything new that comes up.

#### 🧰 The Tools

- [[roam/templates]]:​​
  - Use templates to create a consistent daily structure: activate any saved template by typing ;; and selecting it from the dropdown menu.
- To install an extension, go to the left sidebar, and open Roam Depot. Search for the extension and click__ Install.__ Each extension comes with a description from its creator. For this routine we used:
  - ​[Nautilus](https://github.com/tombarys/roam-depot-nautilus) by [Tomáš Baránek](https://barys.me/#english-section): transforms your tasks list into a visual overview
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FuQmIAia42_.png?alt=media&token=e01b1803-5ccd-4599-9374-408f65b37bbd)
  - [Google](https://github.com/dvargas92495/roamjs-google) by [David Vargas](https://davidvargas.me/): connects to various Google services (we will use the Google Calendar) to your Roam graph
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FHngiEGIlrF.png?alt=media&token=45e42f03-4428-47b5-b32f-ffc2c149c70a)
  - (Optional) If you don't use Google Calendar, and prefer to have a calendar within Roam, you can use the [Full Calendar](https://github.com/fbgallet/roam-extension-calendar) extension by [Fabrice Gallet](https://x.com/fbgallet).
    - ​[Time Tracker](https://github.com/fbgallet/roam-extension-elapsed-time) by [Fabrice Gallet](https://x.com/fbgallet): Track how much time you spend on each activity using categories and sub-categories. Set goals or limits, and get feedback on your daily and long-term time usage.

#### 🪭 The Template

- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FYExRgrlaJp.png?alt=media&token=3f009bd3-a5f2-4c25-b135-6652bcb0f35a)
- 

#### ⚙️ How it works

- **[[Review]]**
  - Start each day by:
    - Surfacing unfinished tasks with this query: ​
      - `​{{[[query]]: {and: [[TODO]] [[__date__]]}}}`
    - ​Pulling in events from your Google calendar
      - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/3LVhfpeLUiZqHWRqVVcU6C/email)
  - This step sets the stage for intentional planning; you can add other events or tasks as well.
- **[[Plan]]**
  - Now that you know what’s on your plate, it’s time to build your day and map it out.
  - Time-blocking is a practice that has been used for ages (Beethoven and Carl Jung used a form of time-blocking) before being popularized by Cal Newport. It consists of assigning each chunk of time in your day to a specific task.
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FgCnraRy7ht.png?alt=media&token=34a60102-cba4-49c6-8733-d96a07708e3a)
  - ​
  - > __Less mental clutter means more mental resources available for deep thinking.​__
    - – Cal Newport, Deep Work
- **[[Log]]**
  - As your day unfolds, use this section to track what you’re doing: when you start on a task, block reference it under here and open a log with the __/current time __feature. When you're finished or take a break, close the log by writing the time and use the Time Tracker extension to see how much time you spent.
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FXcr2cxLHnl.png?alt=media&token=2d7edadb-4f48-48a0-b9e1-355d2f0a24d4)
  - This helps you track what you spend your time on, and the pace you work at. You can also drop in any new events or tasks that come up during the day after planning. Don't hesitate to explore more with the Time Tracker extension features.
- **[[Journal]]**
  - This is your space to reflect: freely or with prompts. Use it to process how the day felt: what worked, what didn’t, what surprised you, or what you'd do differently... anything that comes to mind.
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2F5xQGUm7HUg.png?alt=media&token=d5aefc46-1ecf-41cb-8357-1ea00f05d10b)
  - Not only does journalling help you be more aware about what you feel and want, but it's also really fun to dig up after some time has passed.
- **[[Catch]]**
  - This is your drop zone for anything new that comes up during the day: tasks, ideas, events, random thoughts (or distractions you resisted). Instead of interrupting your flow or cluttering your plan, just toss them here.
- ---

### 🌱 Quality of Life Improvements

- Fix selecting blocks with the mouse when the blocks are aligned horizontally, such as with the horizontal [[block view]] or with css
- Auto scroll the page when selecting blocks with the mouse

#### Commentarii Roamani: Pages/Systems Worth Building, Team Workflows - Part 1 -- [[June 28th, 2025]]

- We’re continuing our series: Pages/Systems Worth Building with a sequence of issues on using Roam for collaboration, or Roam as shared brain🧠
- We're building systems for daily check-ins, weekly progress, meetings, projects and so on... all while keeping things flexible enough for different team styles.
- ---

### Systems Worth Building: Team Workflows ​__Part 1__

#### Step 1: 🛠️ Getting Your Graph Ready for Collaboration

- Before building a shared system, make sure your graph is set up for other people to access and contribute.
- **1. Share Access**
  - Go to Settings → Sharing and invite collaborators by email. This keeps the graph private to your group but accessible to those you've added. You can choose whether each person can edit or view only.
    - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/ia2bs766c2T3inQaP1Hkrv/email)
  - 🕯️ If you're using an Encrypted Graph, don't forget to share the password with your teammates.
- **2. Optional Adjustments**
  - Edit Icons
    - Roam displays a colored bullet next to blocks that were edited by you or others. Each person gets a unique color, making it easier to see who contributed what, at a glance.
    - {{[[table]]}}
      - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/hhYjCwACvxuWpJXZgBPFpS)
        - __each user gets a unique color__
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2Fz0LwsXVrd_.png?alt=media&token=b12c83e9-ff22-47ba-bddd-0077bbd58ff9)
  - Immutable Blocks
    - By enabling Immutable Blocks, only the original author can modify their own blocks. This can help prevent accidental edits by other team members, as well as keep accurate track of individual contributions.
    - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/m35q4RXT4D6W4oKFQxxHHk/email)

#### 🤝 Team Workflows in Roam

- Once your graph is shared and set up, you’ll need a way to work together inside it.We'll be sharing a few core workflows that can serve as a foundation. Adapt them to match your team’s dynamic.
- **🗓️ Daily, Weekly, and Monthly Rhythm**
  - Roam works best when it reflects the natural tempo of your team. Here's a simple structure you can use across three layers of time:
    - daily execution
    - weekly tracking, and
    - monthly review.
  - In this issue of the newsletter, let's look at a daily and weekly system. This is how it works:
  - At the start of each day, the first person who becomes active opens this Team Daily template in the Daily Note (type ;; to toggle the template dropdown menu) for everyone.
    - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/x9uD4ZigSDXbp3NQzyCxmZ/email)
    - The [[Dropzone]] section is for comments and conversations
  - 
  - 🕯️ Pro Tip: Want to get someone’s attention?
  - Instead of tagging their name as a page reference ([[Name]]), tag it as a block reference from that day’s Daily Note. This way, they’ll see a notification next to their name.
  - {{[[table]]}}
    - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/wjWRTq8noey3JdvLnXuXRA)
      - __this comment is directed to Team Member 2 from Team Member 1__
  - Each person works under their own name's bullet in the Daily Notes. Depending on your team's size and working style, people might organize their tasks differently.
  - That said, we highly recommend using a shared format we call the [[Rolling Summary]].

#### The [[Rolling Summary]] 🛼

- At the start of the week (usually Monday), open the [[Rolling Summary]] template under your name.
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/he4PqyfX8JcUWJjvt3g82e/email)
- Fill in the dates, then list your Priorities and Tasks for the week, and add other categories you want.
- {{[[table]]}}
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/52qiRvFEXexjnGSdN3oBy7/email)
    - __as the day goes on, log what you worked on using the __/current time __feature and check off tasks as you complete them__
- ​
- The next morning, head to the new Daily Note and
  - block reference the [[Rolling Summary]] from the previous day
  - replace it with original (this leaves a trace of references behind that you can conveniently open under the original!)
  - block reference all the unfinished tasks and replace them with originals too
  - add new tasks, events, meetings ([[Priorities]]) as needed

- 
  Repeat this each day. By the end of the work week, you’ll have a full trace of what got done, what's left to do or abandoned, and how your time was spent.
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/wh2wY58ooum2yaBRwTambM/email)
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/rfG8KUoezNCdirtJrVLXgA/email)
- ---

#### 🌱 Quality of Life Improvements

- The billing page has a new home: [roamresearch.com/#/billing](https://roamresearch.com/#/billing)​
- Images now open in a better viewer: you can zoom, pan, copy, or download them.

#### 🐞 Bug Fixes

- YouTube links using youtu.be now display correctly when embedded with `{{video:}}`
- ​

#### Commentarii Roamani: Pages/Systems Worth Building, Team Workflows - Part 2 -- [[July 12th, 2025]]

- We’re continuing our series: Pages/Systems Worth Building with a sequence of issues on using Roam for collaboration, or Roam as a shared brain🧠
- We're building systems for daily check-ins, weekly progress, meetings, projects as well as team organization, all while keeping things flexible enough for different team styles.
- ---

### Systems Worth Building: Team Workflows ​__Part 2__

#### Step 1: 🛠️ Getting Your Graph Ready for Collaboration

- Before building a shared system, make sure your graph is set up for other people to access and contribute.
- **1. Share Access**
  - Go to Settings → Sharing and invite collaborators by email. This keeps the graph private to your group but accessible to those you've added. You can choose whether each person can edit or view only.
    - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/ia2bs766c2T3inQaP1Hkrv/email)
  - 🕯️ If you're using an Encrypted Graph, don't forget to share the password with your teammates.
- **2. Optional Adjustments**
  - Edit Icons
    - Roam displays a colored bullet next to blocks that were edited by you or others. Each person gets a unique color, making it easier to see who contributed what, at a glance.
    - {{[[table]]}}
      - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/hhYjCwACvxuWpJXZgBPFpS)
        - __each user gets a unique color__
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2Fz0LwsXVrd_.png?alt=media&token=b12c83e9-ff22-47ba-bddd-0077bbd58ff9)
  - Immutable Blocks
    - By enabling Immutable Blocks, only the original author can modify their own blocks. This can help prevent accidental edits by other team members, as well as keep accurate track of individual contributions.
    - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/m35q4RXT4D6W4oKFQxxHHk/email)

#### 🤝 Team Workflows in Roam: 

- **The [[Sidebar]] and its components**
  - Once your graph is shared and set up, you’ll need a way to work together inside it. This time, we want to share a few templates that could be useful in a team setting, as well as a way to set up your team’s graph.
  - Here’s one example of how you might structure the sidebar to keep everything clear and easy to navigate:
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FLpi6RrGb8V.png?alt=media&token=f166277f-cce8-4b9b-8f32-61fbad0466f2)
    - 🌟 Featured Roam Depot extension: [Sidebar Separators](https://github.com/mlava/sidebar-separators) by [Mark Lavercombe](https://x.com/lavercombemark)​
- **The Components**
  - Each page in the sidebar serves a different purpose. You can adapt the structure to fit your team, but here are a few common components to start with:
    - [[Étiquette]]:
      - A set of rules/short guide to how the team works together. Include information on how to log, how to tag others, and so on. This page is very useful for big teams.
    - [[Disponibilités]]:
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FnvVpVeHa2w.png?alt=media&token=61977e2d-213b-40d4-95c3-ff228ffb7832)
      - A shared page for time zones and working hours. Make a simple table with names, cities, and general availability using the __/table __command. This is especially helpful for remote or part-time teams.
    - [[Name]]:
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FVOF92sMNph.png?alt=media&token=d13d4bdf-a04e-4790-9d92-4d5a4298a242)
      - A space for each person to organize their work in their own way and to indicate how they’ve chosen to do it. Some people prefer to work in the Daily Note, others might prefer a more structured page layout. Either way, the page brings it all together so it’s easy to see what everyone is focused on, especially for 1:1s or quick check-ins.
    - [[Projects]]:
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FXG1rBluFXO.png?alt=media&token=27468492-0737-4e6b-b82c-e6c60476586b)
      - Every project has its own page, linked back to the main [[Projects]] page.
      - We suggest using the same template for each project your team has. Here's an example:
        - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FZmEhD2VASo.png?alt=media&token=6ca405dc-48cd-40fd-9455-a57f9922a301)
      - 🕯️ Pro Tip: Use tags like #active or #inactive and this formula {{or: 🌘 | 🌑 | 🌗 | 🌖 | 🌕 }} to indicate the status of the project
    - [[Meetings]]:
      - The [[Meetings]] page collects all your team’s sessions in one place. Organize them according to what fits your workflow: by cadence (recurring vs. one-off), topic, or project – where each meeting has its own page, with a clear title and date:
      - `[[[[Meetings]] ~ [[Topic or Project page]] ~ YYYY-MM-DD]]`​
      - This format facilitates referencing and staying organized over time.​
      - Use the template below for each new meeting as it gives structure before, during, and after without being too rigid.
        - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2F67PwPSHTU9.png?alt=media&token=550746fa-b930-4dc7-bf9f-92ae11276c4b)
  - Your graph doesn’t need to be perfectly organized to be useful. A few shared workflows go a long way in helping your team stay aligned and find what they need.
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FN7bjUgKYJB.png?alt=media&token=1f23b8e4-9c28-4fb0-85e0-3a7c2db8e978)

### 🌱 Quality of Life Improvements

- [[Linked References]]
  - Sorting system: 
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2F9wqoIRRhKz.png?alt=media&token=3784083e-b1d3-46a0-9716-92884a6f1200)
  - New display settings:
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FMLJK2P6peB.png?alt=media&token=a8c2c8d6-b672-4d8d-96ff-e3e01e84a4b8)

#### Commentarii Roamani: Pages/Systems Worth Building, Reading Flows - Part 1 -- [[July 26th, 2025]]

- In this issue we’re sharing a simple flow for taking reading notes: it's our favorite routine for using Roam in order to make effective use of our readings.
- ---

### Systems Worth Building: Reading Flows ​__Part 1__

- Roam has many features that can elevate your reading by producing searchable and composable insights, which can serve as building input blocks for analysis, synthesis or creative work.
- Here's one we'll cover today: using Roam with [Matter](https://hq.getmatter.com/). Create a powerful flow for memorizing, surfacing favorite highlights, saving memorable sentences, and building a system for active recall!
  - **🧰 The Tools**
    - Quick reminder: install extensions by going to the left sidebar into Roam Depot. Search for the extension and click__ Install__. Each extension comes with a description from its creator. For this workflow we used:
      - ​[Memo](https://github.com/digitalmaster/roam-memo) by [Jose Browne](https://x.com/JoseBrowneX): to turn any block into a spaced repetition card.
      - ​[Matter](https://github.com/getmatterapp/roam-matter) by [The Matter Team](https://x.com/matter): to sync your highlights into Roam.
  - **The [[Reading Flow 🐠]]**
    - {{[[video]]: https://www.youtube.com/watch?v=31xztg6O_ck}}
  - **The Setup**
    - Matter is a read-later app that lets you save, highlight, and export content from across the web including Kindle, Spotify, X (ex-Twitter), Substack, etc. Here’s how to connect it to Roam:
      - Install the Matter app on your iPhone, and the Chrome extension on your computer
      - In Roam, install the Matter extension from Roam Depot
      - Use the QR code to sign in and link your graph
      - Set your Sync Frequency to every 12 hours (or less)
    - ✅ You’re all set!
    - Make sure you also have the Memo extension installed for this particular flow\\\
  - **The Workflow**
    - As you read or listen, highlight quotes you love, passages that resonate, or ideas you want to remember. Your highlights sync into Roam automatically: each article or book gets its own page, and the highlights also appear in your Daily Notes.
    - In Roam, tag a highlight with `#memo` to turn it into a review card. You can also add reflections, context, or thematic tags like `#philosphy` or `#AI.`This builds links between ideas across different readings.
    - Over time, you’ll create a reading stream that feeds your memory, connects your thoughts, and supports your creative work.

#### 🌱 Quality of Life Improvements

- Queries now support sorting and filtering
- Sorting for Linked References moved to Settings
- “Page Date” renamed to “Most Recent” for clarity​

#### 🛒 New Roam Depot Extensions

- __by __Mark Lavercombe__
  - Image OCR: Extract text from images using tesseract.js (great for screenshots, slides, handwritten notes)
  - DOCX Viewer: Upload and preview .docx files directly in your graph

#### Commentarii Roamani: Roam Depot Gems: Algorithms of Thought -- [[August 9th, 2025]]

- In today's issue we spot the light on a Roam Depot extension. Algorithms of Thought (AOT) puts a toolkit of thinking patterns right inside your graph. You'll break down problems, make trade-offs explicit, and leave behind a reasoning trail that’s robust to hindsight bias and future you’s selective memory.
- ---

### Roam Depot Gems: Algorithms of Thought

- The AOT extension bundles several distinct approaches. Here are a few:
  - Agreement, Disagreement and Irrelevance
    - Break a statement or proposal into three parts: what you agree with, what you reject, and what’s irrelevant. This lens separates value from distraction, and often reveals that the crux of a disagreement is narrower than it first appears.
  - Difference Engine
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FchB-jUwCTd.png?alt=media&token=1d89b7f2-9c73-4b5c-82cd-c85f6470a275)
    - Start by describing where you are now and where you want to be. Compare the two and list the differences. Pick the most important one, then apply a technique designed to close that gap. If it works, move on to the next biggest difference; if it makes things worse, backtrack and try a different approach.
  - Want, Impediment, Remedy:
    - Define what you want, identify the obstacle, and decide on the most direct way to remove it. The simplicity is deliberate, since complexity often conceals the real barrier.
  - Next Action
    - Cut through planning inertia by asking one question: __What is the very next step you can take to move this forward?__ The answer should be small enough to start immediately and concrete enough that you’ll know when it’s done. It’s a simple way to turn abstract goals into motion.
  - TOSCA:
    - __T____rouble, ____O____wner, ____S____uccess Criteria, ____C____onstraints, ____A____ctors.__ Begin by defining the problem to be solved (Trouble) and identifying who is responsible for addressing it (Owner). Specify what success looks like (Success Criteria), note the limits you must work within (Constraints), and list the people or groups involved (Actors). Moving through the sequence reveals both the shape of the problem and the boundaries for solving it before you commit to a course of action.
    - 
    - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/xvhuy2v6siBVZKJpkeTUif/email)
    - 
- This extension gives you structured prompts you can run from the Command Palette or hotkeys + leaves a clean outline of your reasoning in the graph, strengthening Roam's role as a thinking tool.

### Acknowledgements 💎

- Thanks to the Roam community and thinkers who’ve kept these ideas alive and evolving.
  - ​[AOT extension](https://github.com/mlava/aot) — [__Mark Lavercombe__](https://x.com/LavercombeMark)​
  - ​[Roam42 SmartBlocks](https://github.com/dvargas92495/SmartBlocks/issues) — Early community work
  - ​[Cortex Futura](https://www.cortexfutura.com/c/algorithm-of-thought/) — Algorithms of Thought background
  - ​[VirtualSalt](https://www.virtualsalt.com/problem-solving-techniques/) — Problem-solving techniques
  - ​[Zsolt’s blog](https://www.zsolt.blog/2020/12/tosca-pattern-for-framing-problems.html) — TOSCA framing
  - ​[Edward de Bono](https://www.debono.com/de-bono-thinking-lessons-1) — PMI and related thinking patterns

### 🌱 Quality of Life Improvements

- Add filter on Daily Notes page.
- Option to include/exclude all Daily Notes.
- Move Query builder above results for live updates.
- Clause to filter all Daily Notes at once.
- Search now includes page titles.
- You can read more about these updates in [this thread](https://x.com/roamresearch/status/1953253277635657969?s=46).

#### Commentarii Roamani: Roam Depot Gems: Roam Portal, Search+ -- [[August 23rd, 2025]]

- In this issue we explore more Roam Depot extensions that encourage search and discovery. Roam is built to connect ideas across time, and with Search+ and Roam Portal, that ability becomes even more powerful.

### Roam Depot Gems

- To install an extension, go to the left sidebar, and open Roam Depot. Search for the extension and click__ Install. __You can toggle it with __Cmd + P__.

### [Roam Portal](https://github.com/dkapila/Roam-Portal) by [Dharam Kapila](https://x.com/dharamkapila)​

- As the name suggests, Roam Portal is a gateway into your graph: a search engine that lets you step through and explore it from new angles.
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FbUqG9S-dN4.png?alt=media&token=c2ce5b74-e638-4c32-a0aa-8076edfe20ff)
- Roam Portal turns search into exploration. Filter by page, user, or date, then shift into 2D or 3D visualizations of your graph. Locations mentioned in your notes appear on a map, timelines show ideas surfacing over months and years, and references can be sorted by frequency or attributes. Even tweets, images, and reactions inside your graph become searchable. Instead of narrowing in, Roam Portal is about stepping back and seeing your graph from a new angle.
- Say you’re preparing for a presentation. With this extension, you can trace when the main theme first appeared in your notes, see which related topics clustered around it, and spot sources you haven’t revisited in a while. Rather than scrolling through a flat list, you get a map of how your ideas developed over time. That perspective helps you notice angles you might have overlooked + gives your work a stronger backbone.
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FR3XDxzfV4X.png?alt=media&token=d68889b4-24ac-41b7-8168-b7d4e6f6aeb7)

### [Search+](https://github.com/dive2Pro/roam-search-plus) by [hyc](https://github.com/dive2Pro)​

- Search+ is Roam’s native search on steroids.
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2F_eHXdQVV-T.png?alt=media&token=6c5ddc12-3ee6-4c65-adba-b8d0563441a4)
- Where the default search gives you a list, Search+ goes further. You can narrow queries by page or time range, sort results by date created or edited, and save searches you’ll want to revisit. It supports exact phrases, case sensitivity, and regular expressions for precise control in large graphs. You can copy results as references or open them in the sidebar, making search part of the building process instead of just retrieval. These features are especially useful when you’re working on a focused project.
- Imagine you’re writing a paper on Russian realism in literature. With Search+, you filter all your notes tied to authors like Tolstoy, Chekhov and Gogol, isolate your most recent highlights, and save that search for one-click access the next time you open Roam. From there, you can drop the results directly into your draft page, where they’re ready to be shaped into an argument. Search shifts from being a lookup tool to something closer to a staging ground for ideas.

### New Roam Depot extension 🛒

- ​[Roam References Radar](https://preview.convertkit-mail2.com/click/dpheh0hzhm/aHR0cHM6Ly9naXRodWIuY29tL2RpdmUyUHJvL3JvYW0tcmVmZXJlbmNlcy1yYWRhcg==)** **by [hyc](https://preview.convertkit-mail2.com/click/dpheh0hzhm/aHR0cHM6Ly9naXRodWIuY29tL2RpdmUyUHJv): A Roam extension that surfaces hidden links in your graph by suggesting relevant references. It helps you spot connections you might have missed, expanding the web of ideas as you go.

#### Commentarii Roamani: Back to School -- [[September 6th, 2025]]

- Fall is the season of academic beginnings, when new courses and obligations accumulate quickly. We dedicate this issue to new and returning students, but also more generally to all learners who use Roam. Think of your graph as your course hub that consolidates schedules, syllabi, and study materials.

### Back to School 📍📌📚✂️🎓📕📒✏️🚌📓📖📆🚍📝📔📘🏫📙📏📎🚸🖌️📗🖍️📅🖇️🗓️📐🖊️📋

- The phrase "Back to School" recalls the Homeric exhortation αἰὲν ἀριστεύειν which means __ever to excel__. In Homer, the phrase was spoken as a charge from father to son: to strive, to surpass, to bring honor through excellence in all domains. For us, the return of fall carries the same call. In other words:
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FkoO53WL1zG.png?alt=media&token=a8a845f1-1140-4f16-b10a-3a87de1f0178)
- Roam is well suited to this rhythm of striving because it allows us to be messy without suffering for it.

#### __The Course Hub__

- The course hub gathers syllabi, timetables, and study materials into one place. Here's how to organize it:
  - Courses: list every class's link to its own page
  - Schedule: keep a copy of your timetable
  - Resources: store files and key links (like the printing procedure)
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FzrG2zqgk9X.png?alt=media&token=ae23b2bf-cec9-4cf2-ad0d-4bb3c3808f87)
- Then, read through your syllabi (or course outlines) and feed all the dates to ChatGPT so it puts everything in the same format:
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FtBqUxsg3KU.png?alt=media&token=5dea2ef7-92c0-49af-a13a-ca607a25ddc8)
- Add the test dates and deadlines to your graph:
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FeChVNR_WA2.png?alt=media&token=929da073-1640-4966-a98b-9ecde2e9aaa2)
- When preparing for the next day, or the next week, all the homework will be referenced in your Daily Notes.
- Study Tip: manually add references for possible times to keep yourself prepared. For most students, the difficulty lies less in exertion than in organization, because hard work follows when the tasks are clearly arranged.
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2F1MACp7xLHV.png?alt=media&token=f6f68a5e-4e58-47ad-9a13-e8747278ba7f)

#### __Roam 🤝 Calendar__

- Seeing your time laid out visually makes it easier to organize for studying, exercise, and fun, and it sets you on the path to __ever excel__.
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2Fq7iGZ-qUic.png?alt=media&token=c692ec77-a4f2-4f1e-a3f3-59764dc645c2)
- Use the [Google](https://github.com/dvargas92495/roamjs-google) by [David Vargas](https://davidvargas.me/) extension to connect your google account to Roam, or the [Full Calendar](https://github.com/fbgallet/roam-extension-calendar) extension by [Fabrice Gallet](https://x.com/fbgallet) to have a calendar within Roam.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/8HG4RPZVQNJak3iReiLSKU/email)
  - __follow these steps to connect Roam to your Google account__
- To install an extension, go to the left sidebar, and open Roam Depot. Search for the extension and click__ Install.__ Each extension comes with a description from its creator.

### 🐞 Bug Fixes

- Tags are now created correctly after images
- Filters with apply as expected
- works within range (now extended to 10 years)​
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/ihziKzTQcPjCwmRbgXwUg5/email)

#### Commentarii Roamani: Back to School, Part 2: Notes and Exams -- [[September 21st, 2025]]

- Last time we set up Roam as your course hub. Now that classes have started, the focus is on taking notes, keeping them connected, and getting ready for exams.

### Back to School, Part 2: Notes and Exams

- We hope everyone had a great Back to School this September! If you haven’t already, check out [our last newsletter](https://roam-research.kit.com/posts/commentarii-roamani-back-to-school?_gl=1*lwoeew*_gcl_au*OTA1ODQ4MDE0LjE3NTY5OTY4MDEuMTkyNDQ2OTY3LjE3NTg0MzA1NjUuMTc1ODQzMDY3Nw..) on setting up your courses for this semester in Roam.
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2Fwrz8Ci6X1u.png?alt=media&token=40490d1f-44ea-4366-b21c-57495ee2bcb3)
- Now, preparing for exams is a different task. We’ll show you how to take notes in Roam and organize them so you can spend your time studying, not figuring out what to study.

#### __Where__

- Add a section for notes on each course page. For every lecture, insert the date with `/today` and take your notes beneath that block.
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FEf02FtzXh_.png?alt=media&token=5a171889-f379-426f-aab6-2c48515ffc5c)

#### __How__

- During lectures it’s normal not to know the full structure of the material. The best approach is simply to keep writing. Roam’s bullets and nesting structure will keep your notes organized as you go, and whenever an idea pops up or you come across a concept you've already seen, simply add a hashtag and keep moving.
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/b4Du3epR33c1FXTmkJGPKR/email)
- After taking your initial notes, turn them into permanent notes or flashcards for review. Once you have a general overview of the topic, it’s easier to distill the main points into material you can memorize.
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/9FUgSejRrU5gChN7TgyRS1/email)
- See [this issue](https://roam-research.kit.com/posts/commentarii-roamani-pages-systems-worth-building-learning-using-roam-depot?_gl=1*p5snoa*_gcl_au*OTA1ODQ4MDE0LjE3NTY5OTY4MDEuMTkyNDQ2OTY3LjE3NTg0MzA1NjUuMTc1ODQzMDY3Nw..) for tips on creating flashcards 🌟
- Then, use the `/diagram` feature to build visual maps of your course and link your permanent notes together.
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/xsfpXw3Vk7LykKzSZK3DPZ/email)
- Sometimes professors draw on the board, and it can be difficult to capture that directly in Roam while typing. In those cases, open Excalidraw with `/excalidraw` and sketch it out.
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/uS9zLRUpT33zyxJRr7QkAm/email)
- Study Tip: Under each test in your Course Hub, add references for possible times you can study. These will surface in your Daily Notes as reminders and keep you prepared.
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/iMWN8bbbsatoM9gtgjDJPn/email)
- We also recommend using any Roam Depot extensions to enrich your workflow, more on this in the next issue!

#### Change Log 🪵

- Bug fixes for export
- Database update for upcoming features
- "Replace with another DNP" in page reference right-click menu (makes the alt-click UI for daily note page refs more discoverable)
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2Ft6XjXIz83d.png?alt=media&token=881eb84b-cfae-40c6-bdef-6d20e2212429)

#### Commentarii Roamani: Winter Arc ❄️ -- [[October 5th, 2025]]{{[[video-timestamp]]: {{[[video]]: https://www.youtube.com/watch?v=S3xEDqY2sLI}} 00:00:02}} {{[[video-timestamp]]: {{[[video]]: https://www.youtube.com/watch?v=S3xEDqY2sLI}} 00:00:10}} {{[[video-timestamp]]: {{[[video]]: https://www.youtube.com/watch?v=S3xEDqY2sLI}} 00:00:10}} {{[[video-timestamp]]: {{[[video]]: https://www.youtube.com/watch?v=S3xEDqY2sLI}} 00:00:10}} {{[[video-timestamp]]: {{[[video]]: https://www.youtube.com/watch?v=S3xEDqY2sLI}} 00:00:11}} {{[[video-timestamp]]: {{[[video]]: https://www.youtube.com/watch?v=S3xEDqY2sLI}} 00:00:11}} 

- Every October, the Winter Arc picks up online: the idea is to finish the year strong instead of waiting for January. We'll show you how to make it work inside Roam.
- We’ve launched a [[New Feature]]: the PDF Annotator. It lets you highlight, tag, and add notes to your PDFs directly in Roam! Check out [this post on X](https://x.com/RoamResearch/status/1973905945336897807).
- {{[[video]]: https://www.youtube.com/watch?v=S3xEDqY2sLI}}
- ---

## The Winter Arc

- The Winter Arc is a stretch of focus you could undertake from October to December, to start working early on building momentum before the flood of New Year’s resolutions. While others slow down or hibernate, the cold months test consistency and reward those who lock in early.
- ![Goku's Warm Up %284K%29](https://i.ytimg.com/vi/LijlOP8XyMA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAoz_McBcn32hyBs61h4AVEThq9fQ)
- It’s about using the last three months of the year to build structure, discipline, and progress that last through the holidays and carry into the new year.

#### __Big Picture__

- **Step 1: List all your goals**
  - The first step is finding your goals and writing them down where they can take shape. Create a page in Roam called [[Winter Arc]] and list them under [[Goals]]: we like it simple.
- **Step 2: Plan out three goals**
  - Add a section called [[Focused Goals]]. At the start of each week, select three goals, decide when you’ll work on them, and define the specific actions that will move them forward.
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FnZz7K8MSkL.png?alt=media&token=e41654b2-03dd-46c0-9a3b-25e28e5e57c7)
- **Step 3: Track your progress**
  - Each week, open [[Progress]] and note what __actually __happened. Take notice of the goals you ignored and the ones where you made progress. The point is to see your path take shape over time, to see your results evolve. If you’re training, include weekly photos or numbers. If you’re creating music, art, or writing, add each new version or update here. Tip: by using the __/streak__ feature like this:
  - ` {{[[streak]]: [[Goal 1/Build stronger attention]]}}` -> you'll have a visual record of every day you've worked on Goal 1:)
    - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/7oWj93LR8N9SaNvcZQahhQ)
- **__Day to Day__**
  - Each day has a small place in the arc you’re building. The goal isn’t to push harder but to stay present in the work. Some progress is visible, most of it isn’t, but each repetition leaves a trace that builds on the last. Over time, the pages begin to form a streak of their own, a quiet line of effort running through the season. You’ll see where your attention goes, and how often it returns. That pattern is the real measure of consistency.
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/tRbnGcEnCDqhjfdkaeR5aF)
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/kGSwgGfk38KG48PV7mmMDr)
  - If you’d like to give this rhythm a home, here’s one way you could do it. A daily template can hold your goals, actions, and reflections in one place, making it easier to see how the days start to link together.
  - A simple Roam setup that connects long-term structure to daily rhythm. The Focused Goals query pulls the week’s priorities from the [[Winter Arc]], and the daily sections guide short, intentional work sessions. Here's what a full day could look like:
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2Fi3k4-tt1YW.png?alt=media&token=95468cae-7fa5-40dc-b880-94c97e4749c2)
    - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2Fox_2c_BVpO.png?alt=media&token=5da65e65-2eec-408f-800b-1e65be15dce8)
- Start small. Stay steady.
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/ppSBPCaN9jijhKxNu35cjw/email)

#### Commentarii Roamani: Roam Live Ai -- [[October 19th, 2025]]

- This issue focuses on the Live AI extension, which integrates advanced language models directly into your graph, enabling you to harness the power of AI without ever leaving Roam.
- ![Willem Dafoe's I'm Something of a Scientist Myself Meme](https://uploads.dailydot.com/320/d5/4f26637ee6428891.png?auto=compress&fm=png&w=2000&h=1000)
- ---

## The AI extension for Roam: Live AI

#### Setting it up

- To install an extension, go to the left sidebar, and open Roam Depot. Search for the [Live AI](https://github.com/fbgallet/roam-extension-live-ai-assistant) extension by [Fabrice Gallet](https://x.com/fbgallet) and click__ Install.__ This extension comes with an extensive, detailed, awesome description from its creator.

#### How it works

- The first thing you should do after installing it is get an API key from OpenAI, Anthropic, or another provider. Simply follow the links given in the extension description and you'll be all set to start exploring.
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FM_p2b4X8TD.png?alt=media&token=c2a6fdbd-5cec-4c08-81f0-ac5c747342f6)
  - There are many other settings, but don't worry about those for now (unless you want to 🤷‍♀️).
- Now Live AI will appear in your sidebar:
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FP-gaUeMqkZ.png?alt=media&token=98e5cccb-9eef-4b0a-a7bc-723ede01b637)

#### Start here!

- There is so much to explore in this extension, so we recommend starting with these four functions (which we will explore in more depth in the following issues).
- 1. Voice Transcribing
  - Dictate your thoughts directly into Roam, and let AI transcribe them in real time. It’s the fastest way to capture fleeting ideas before they disappear. Ideal for stream-of-consciousness thinking, meeting or lecture notes, hands-free journaling, and even translating!
- 2. Ask AI
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/5KSRN5TnKEgNXqe48ZMC5W/email?auto=)
  - This command sends the focused or selected blocks as a prompt to the default model. The response is added directly to your graph as child blocks, making it the quickest way to ask the AI anything.
  - {{[[video]]: https://www.youtube.com/watch?v=KoprE9zl1-U}}
- 3. Ask Your Graph Agent
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/mFM6pKMXRNgmDqUBsxbxuU/email)
  - This agent performs semantic search and reasoning across your entire Roam graph. It interprets natural-language queries, retrieves relevant blocks and pages, and lets you view, filter, or even chat with the results. You can choose from three privacy modes (private, balanced, or full) to control how much of your graph is sent to the language model. Ask questions across your entire graph and receive synthesized answers based on your own notes, links, and pages.
- 4. Outliner Agent
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/vLdgzhmBuY8cF6Kzvf9bs8/email)
  - This agent modifies existing outlines directly. It can add, remove, or edit specific blocks inside a defined structure.
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/891BCJ3S9NyKPMowAwMhcx/email)
  - __[from Fabrice Gallet's documentation](https://github.com/fbgallet/roam-extension-live-ai-assistant/blob/main/docs/live-outliner.md)__
- 
- These are the basics of the amazing Live AI extension. Explore with it more until the next issue where we will walk through more features in more detail.
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/jtUuwe6g51WBVkFV1k6h18/email)

#### Commentarii Roamani: Live AI in practice - Part 1 -- [[November 3rd, 2025]]

- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/eQQNqJK2FKA4C5vqawu8yb/email)
- This is the second issue focusing on the Live AI extension, which integrates advanced language models directly into your graph, enabling you to harness the power of AI without ever leaving Roam 🔮 See [our previous issue](https://roam-research.kit.com/posts/commentarii-roamani-roam-live-ai) for more if you haven't already!
- ---

### 🧚 Live AI in practice

- Today we're looking at how to use the extension (created by [Fabrice Gallet](https://github.com/sponsors/fbgallet)) as a writing assistant. As we go through the process of writing a research paper with Roam, we'll look at some of the amazing tools it can help us with.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/ryHMaU9GnUv8McQ2s1AdSs/email)
- This week is __Part 1__: choosing your topic and gathering sources.
- ---

### 🎃 Step 1: Topic Selection

- First, you need to find the question you’ll ask for your research paper.
- If you’re writing a research paper just for fun and have no idea where to start, try the __Ask Your Graph__ tool and use prompts like:
  - What patterns or recurring themes appear in my notes?
- to surface the topics you revisit a lot, the ones you’re still curious about or used to be. From there, you can dig deeper 🧟‍♂️
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/kNMrDMgE4vxGS76kDwTPAv/email)
- If you have some ideas but you're not sure how to shape them in a clear research question, use the __Ask AI__ tool to talk it out.
- You can also record yourself with the __Voice Transcription__ tool and let it reply in text (see [our previous issue](https://roam-research.kit.com/posts/commentarii-roamani-roam-live-ai) to learn how).
- Let's say we want to write a paper about...WITCHES 🧙‍♀️

### 🎃 Step 2: Research

- Now that we have a theme, it’s time to gather sources. Just converse with the AI model of your choice.
- [watch the clip here!](https://api.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/6An3J91X8AVMJtPNuvLhvF/player)
- And use it to find both primary and secondary materials related to your topic:
  - __Find primary and secondary sources about [topic]__
- Once you’ve found a few, you can ask for short summaries to quickly grasp each author’s main argument before diving in.
- Don't forget, this extension supports all your favourite AI models 👻
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/krcFGZxPCAkKsfs5dp4kjf/email)
- ---
- In __Part 2__, we’ll move from research to writing and see how to turn those ideas into a polished essay using Roam’s creative tools.
  - ![The Hogwarts library | Official Harry Potter Encyclopedia](https://contentful.harrypotter.com/usf1vwtuqyxm/yMjiCe7Wjaf9boKOVO2Ya/a4113bf0b16dd43ffc02172c3318dbee/the-hogwarts-library_1_1800x1248.png?q=75&fm=jpg&w=600&h=416&fit=pad)
- So, over the next two weeks, read through your research and jot down every idea that comes to mind so when the next issue comes out, you can follow along and write your paper in Roam.

#### Commentarii Roamani: Live AI in practice (Part 2) + roamOS -- [[November 16th, 2025]]

- This is the third issue featuring the [Live AI](https://github.com/fbgallet/roam-extension-live-ai-assistant) extension, which integrates advanced language models directly into your graph, enabling you to harness the power of AI without ever leaving Roam. See [our previous issue](https://roam-research.kit.com/posts/commentarii-roamani-live-ai-in-practice-part-1) for more if you haven't already!
- Also in this issue: a community spotlight on the new [roamOS](https://www.roamos.work/) extension!
- ---

### Live AI in practice

- Today we're continuing to look at how to use the extension (created by [Fabrice Gallet](https://github.com/sponsors/fbgallet) and available via Roam Depot) as a writing assistant. As we go through the process of writing a research paper with Roam, we'll look at some of its amazing tools and its newest updates!!!
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/gRZpTkqUsP9fgB1PPEFny2)
- As a reminder, last week we worked on choosing a topic and gathering sources.
- This week is __Part 2: __the writing process
- ---

### Newest Updates:

- One of the main reasons we use Roam is because it connects all our thoughts seamlessly while staying easy to work with. This extension takes that a step further, giving you the ability to directly chat with your graph.
- This version is now even simpler and smoother to use, as it has a chatbox:
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/jy1HWZvNSV8WTQTyhWjhPx/email)
- As well as chat storage!
- We mentioned this last time, but one capability that truly sets this extension apart from other AI tools is its ability to search your graph AND all the info that comes with a language model at the same time, something you can't do with any other AI.
- You can even restrict the amount of information you give, along with many other preferences:
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/bSyhj7PHS82Q9Bgjih2WEM/email)
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/cMuhbLEaQbTkC6DwyADhCN/email)
  - __style, prompts, model settings...__
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/bgTFVHEdJyrHAwSaKB8rcp/email)
  - __layout preferences__
- ​[Fabrice Gallet](https://buymeacoffee.com/fbgallet) added many many instructions and details on his extension, which you can find in Roam Depot:
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/jFd5mWKMND88StBRdcMknw/email)
- Now let's pick up where we left off last week on our research paper...

### Step 3: Writing - outlining, drafting, and correcting

- After you read your sources, you'll probably be able to draw parallels with other ideas you've encountered or came up with, so last week we suggested to jot all of them down.
- We organized our notes according to the sources:
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/PfAjrFVx1H7L8EgWF61qv/email)
- 🌟 Featured Extension: [Roam PDF Highlighter 2](https://github.com/c3founder/ccc-roam-pdf-2) by [CCC](https://x.com/cococ_rr) 🌟
- And then did some brainstorming...
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/3iUgFDPyBzhnDVk844Hi6U/email)
- The LiveAI tool can really come in handy when it comes to writing because you can start by using the action rubric to help plan your project or paper, then use the content analysis rubric to summarize, extract key insights or reasoning structures as you're researching, and finally use the creation, rephrasing, and critical reasoning tools to write, correct and perfect your drafts, as well as to hedge against haters.
  - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2F5XH5bctonf.png?alt=media&token=f5521ec7-8939-40b5-8bf9-724978eb5d72) ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2Fpp-2k-NfZ0.png?alt=media&token=4d07977b-90ee-489e-84c6-eaf4407a903e) ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FzYhwuoW02f.png?alt=media&token=734ebaa3-6644-4e26-9e5c-e9724d775ac8)
- Everyone’s writing process differs, but Live AI offers tools that can seriously speed things up regardless of how you approach writing, especially if you don’t have a set procedure and tend to be very ADHD about it 🌀
- ---

### 🌱 Community Spotlight: [roamOS](https://www.roamos.work/)​

- Community member [Ryan Sonnek](https://codecrate.com/) built roamOS, a native iOS and macOS app that brings your Roam graph into your daily workflow. Quick capture thoughts from anywhere via keyboard shortcuts or Siri, without opening Roam. Display your custom Datalog queries as widgets on your home screen or desktop. Your second brain, integrated with your operating system.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/vnNN3Sp4sGqXRU19degXAp/email)

### What it does:​

- 🚀 Quick Capture Everywhere - Capture to Roam instantly via keyboard shortcuts, Siri voice commands, menu bar launcher, or iOS app—without opening your browser.
- ​
- 🧩 Knowledge Widgets - Display your custom Datalog queries as native iOS/macOS widgets. Put your TODOs on your lock screen, daily notes on your desktop, or random quotes that surprise you throughout the day.
- ​
- 🔗 Deep System Integration - Your Roam graph integrates with Siri, Spotlight, and Shortcuts. Query your second brain from anywhere in your OS.
- 
- 📱💻 Cross-Platform - Works on iPhone, iPad, and Mac with universal purchase. Pay once, use everywhere.

### See it in action:

- Quick Capture:
  - {{[[video]]: https://www.youtube.com/watch?v=CJC5O4MrVbE}}
- Query Widget:
  -  {{[[video]]: https://www.youtube.com/watch?v=vpmUH5XQlvc}}
- Simple pricing: $20 one-time purchase includes both platforms. No subscriptions. Lifetime updates.
- Learn more and download it [here](https://www.roamos.work/).
- 
- ---
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/J4J3XhJx4djbpBVe9cWN7/email)
  - __see you next time!!!__

#### Commentarii Roamani: Roam Depot Gems: Better Tasks -- [[November 30th, 2025]]

- In this issue, we look at [Better Tasks](https://github.com/mlava/better-tasks), a Roam Depot extension by [Mark Lavercombe](https://github.com/mlava) that brings structured, repeatable task logic directly into your graph. It treats each TODO as a block with clear attributes: __repeat, start, defer, due__ so you can manage tasks without leaving Roam or maintaining a second system.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/6cJJSR92j5n4EE46vCFiem)
- ---

## 💎 Roam Depot Gems: Better Tasks 💎

- Better Tasks works quietly: when you complete a repeating task, the extension can generate the next instance on the correct day based on your settings. One-off tasks use the same attributes without a repeat rule. Everything is stored directly in Roam blocks, so the system stays transparent and easy to inspect.

#### The Core Mechanism

- A Better Task is a TODO with child blocks that hold its data. You create one by opening Roam’s Command Palette and selecting Create a Better Task (or by converting an existing TODO using Convert TODO to Better Task):
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/cadwZRuVojbV2H2uiwjYp7/email)
- Completing the task writes a completed attribute and, if a repeat rule is present, creates the next occurrence according to your settings. You can add optional attributes for availability and resurfacing:
  - BT_attrStart -- when the task becomes available
  - BT_attrDefer -- when it should reappear
  - BT_attrDue -- when it is due
  - __and more...__
- Leaving the repeat field blank produces a scheduled one-off task. It behaves the same way, just without generating a successor.

#### Inline Pills

- When a Better Task is collapsed, the extension shows a pill beside the checkbox. The pill summarizes the task’s attributes:
  - ↻ the repeat rule
  - ⏱ / ⏳ / 📅 start, defer, and due dates
  - __"__⋯__"__ menu for task actions: skipping, ending recurrence, generating the next instance, and adjusting metadata (snooze applies to the due date when no start date is set)
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/59U2xXiTQMs3ds3a5tczp3)
- Pills hide automatically when the block is expanded so you can edit the child blocks directly. Date formatting is optimized for scanning: items due within seven days show the weekday name; anything further out uses a short date.
- Pill interactions match the extension’s interface:
  - click a date pill to open that Daily Note
  - Shift+Click opens it in the sidebar
  - Alt+Cmd/Ctrl+Click snoozes the due date one day forward
  - Alt/Ctrl/Meta+Click opens a date picker
  - metadata pills cycle their values or open the related pages
  - Alt+Click on the repeat pill copies the rule text
- Completed tasks hide their pill until the next occurrence is created.
- Better Tasks supports optional child-block fields for project, waiting-for, context, priority, and energy. These values are not required, but when present, they appear as pill segments and become filterable in the dashboard
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2F9hsGA2IXW7.png?alt=media&token=99cfd4d6-277b-4936-ab15-26c7711014c4)
- 

#### Dashboard

- The dashboard is a floating, draggable panel that lists all Better Tasks. From the dashboard you can snooze or skip tasks, open their source blocks, adjust metadata, and edit repeat or date values through the same pill interactions used inline. A quick-add bar at the top lets you create new tasks, with AI parsing applied when enabled.
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/c2Z9qaSxpEYjJBQYc7VmjV)
- It updates automatically as attributes change and gives you filters for recurrence, start/defer status, due buckets, and completion state:
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/m8nyFeVn37xCxde3o81dVJ)

#### Settings

- In the Roam Depot extension settings, you can choose where the next occurrence appears (Daily Notes Page, same page, or under a DNP heading) and rename all attribute labels to match your graph.
- You can also enable confirmation before spawning the next task, set the first day of the week, turn on AI parsing with your own API key, and adjust the checkbox threshold for pill rendering:
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/qV2Q6d4Q5qwRH1FXcjAStU/email)
- ---
- There’s much more than we can cover here in Better Tasks, and the extension rewards exploration. Try the menu, adjust the settings, experiment with the dashboard filters, and see how different repeat rules shape your workflow. If you want to capture tasks faster, you can also enable the optional AI parsing mode with your own API key. Read the full documentation [here](https://github.com/mlava/better-tasks)​
  - ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/oBZkiKk8xDv3arhvdKvZpd/email)
- see you next time!!!

#### Commentarii Roamani: Roam Reader!!! -- [[December 13th, 2025]]

- Reading produces value when a thought interrupts the page. A sentence lands, a question forms, a connection starts to appear, and then the article keeps moving. What matters is whether that moment turns into something you can work with later.
- Roam Reader is your tool for reading intentionally: remix your notes, comment on them, tag them, nest them. Watch our [in-depth tutorial on YT](https://www.youtube.com/watch?v=stJ7SGo6J9w) here and [our thread on X](https://x.com/RoamResearch/status/2000051955746394488)!
- It's built around capturing the moment in a form that stays flexible. As you read on the webpage itself, your notes are directly by it, in the sidebar. The article remains intact, with its intended layout and context but your thinking grows alongside it.
- Your notes could then be remixed, pulled into other parts of your graph, and reused across projects. Over time, reading produces fewer static traces and more material that stays alive inside your system.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/wPfKVn4VXNKw5Q74tAbRr9/email)
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/gBsbp6E6fH1of8KKNUJdjo/email)
- ---

#### Setting it Up

- Visit the Chrome Web Store and find the [Roam Reader extension.](https://chromewebstore.google.com/detail/roam-reader/kghmbkhikifcnkjoakokkhdkfdhieonb?hl=en&pli=1) Then, add it to chrome and pin it to your Address Bar. Go to the article you wish to read or annotate with Roam Reader, click the astrolabe once to sign-in via Google/Apple or Email+Password and a second time to select which graph to use for your reading lists and annotations.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/kJTa4onJx9oAod1xzy56Z1/email)

#### Saving an Article to your Reading List

- To save an article to your reading list, click the astrolabe in the top right corner to open the menu. Tweak the metadata as you like, and add some tags. Click on Save To Inbox or some of the other default reading lists like: Shortlist & Archive.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/dqXGanz5LhykwUnZpNbRuY/email)

#### Taking Notes & Highlighting

- With the article open, click the astrolabe icon and choose Take Notes instead of saving it to your reading list. A sidebar opens beside the page, where you can start writing notes under today’s date, indented beneath Notes by [[User]].
- To highlight, select text in the article and click the highlighter icon that appears. You can also choose a highlight color! Each highlight is added automatically to the sidebar, ordered according to its position in the article. If you indent the empty bullet beneath your most recent highlight, the next highlights will nest underneath it, making it easy to outline and group related passages as you go.
- You can add tags and comments as you highlight using the icons provided. Roam handles the formatting for you, inserting the # and indentation automatically.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/qa7DwjpAwwbxn3tHkjd3vL/email)

#### How It's Organized In Roam

- In Roam, to avoid cluttering your graph, saved articles first appear as blocks on [[Reading List: Inbox]]. They remain simple blocks with their metadata nested underneath. Each entry follows the default template set in your Roam Reader settings, which you can change at any time. Only when you start taking notes on an article does it expand into its own page.
- If you want more structure, you can update the title template to use a namespace-based format, which keeps reading material grouped and easier to navigate as it grows.
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FyaS6cu6ws7.png?alt=media&token=741acb39-f379-4bd8-a626-952266f5db58)
- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FHjwIk8Hytr.png?alt=media&token=8d1fc169-8fb9-4ef4-8ad8-4c04efcf7162)
- ---
- Roam Reader is designed to stay close to how reading on the web already works. Many articles today are readable, carefully laid out, and worth engaging with in their original form. Stripping them down -- as most reader apps do -- often removes context, structure, or even content that matters.
- You read where you are, take notes intentionally as ideas land, and let structure form early without interrupting the flow. Notes remain flexible, reusable, and easy to pull into the rest of your graph when they become relevant.
- If you already use Roam to think, write, or plan, this fits naturally. Reading becomes another input to your system, shaped as you go, and still usable long after the tab is closed.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/h8asgw4kFZuwTR938U2Qxy/email)
- onward! roam & read:)

#### Commentarii Roamani: 2025 Roam Wrapped 🎁 -- [[December 29th, 2025]]

- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/c8LuPTGZz4JKJ52qXP3mKt/email)
- In this issue we'll do a wrap-up of the main ideas and systems we explored in __Commentarii Roamani__ in 2025.
- If you're a new subscriber, read on to see where to go for content you've missed! And if you've been around for the whole journey, revisit the issues that could help you turbocharge your entry into 2026! Either way, think of bookmarking and sharing this issue as a useful reference tool (we linked all the issues to make it handy)
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/czisE7QdtVV9UGzBNid8Wq/email)
- The newsletter issues we've sent out fall into three categories: building personal thinking systems, learning and knowledge construction, and AI as a thinking partner.
- ---

### Building personal thinking systems

- A large part of this year focused on building workflows and systems that improve our daily life, in Roam.
- ![19 Reasons We Are All Actually Every Single Disney Character](https://i.pinimg.com/originals/29/fd/17/29fd174542dee9b5ce4d98568922248b.gif)
- **Experiments** -- is a page where you log new things you are trying with deliberation, along with the changes you notice over time, and it's meant to document what works and what doesn't to improve your day-to-day life. Over time, this works to amass empirical evidence for your choices and iterate moving forward on what habits to keep.
- ​**Via Negativa** -- is a page where you write down habits, projects, or goals you have decided to stop pursuing. Writing these decisions down helps clear mental space, because once something is explicitly abandoned, it stops resurfacing.
- ​**The Daily 5** -- is an organized daily workflow in Roam built around a fixed template with five sections: review, plan, log, journal, and catch. Each day, you open the same structure in your Daily Notes and fill it in as the day unfolds, removing the inertia from starting each day, but also offering a predictable structure to follow.
- **Team Workflows pt.1 and pt2** --  is a system that focuses on using Roam as a shared space. The issue covers setting up a graph for collaboration and adding lightweight structures for daily check-ins, weekly progress, meetings, and projects, so teams can share context and track work over time without forcing everyone into the same workflow.​
- **Algorithms of Thought** -- is an extension that structures reasoning itself. It provides explicit thinking patterns for breaking down problems, comparing options, and clarifying decisions. Instead of keeping reasoning implicit or scattered, it leaves a clear trace of how conclusions are reached, which makes decisions easier to revisit and revise over time.
- ​**Better Tasks** -- is a task system in Roam where each task is a block with its own dates and repeat rules. Instead of rewriting the same tasks or relying on memory, tasks automatically resurface when they are due or available.
- ​**Focused Goals** --  is a planning workflow built around a fixed time window and a small number of priorities. We explored this workflow during the Winter Arc, but it can be reused for any focused stretch of work.

### Learning and knowledge construction

- This was another recurring theme: we posited that learning takes shape over time, from initial setup to reading, studying, and reuse.
- ![Beauty And The Beast Spin GIF by Disney - Find & Share on GIPHY](https://i.pinimg.com/originals/52/cb/bb/52cbbb80c365adf60c83fac6d95a20da.gif)
- In **Back to School pt1 and pt2 **-- we looked at how to organize courses, schedules, syllabi, lecture notes, and exams in Roam.
- We also created the **Learnloop** workflow to look at how notes can be created and revisited regularly through short reviews and spaced repetition. This way, understanding builds over time instead of accumulating only around deadlines. This was our first peek at using AI from within Roam, which is covered in the next section.
- Finally, we look at reading as part of the same process. In **Roam Reader**, we show how reading can happen alongside your notes, with highlights and comments captured in context and saved directly into the graph, making what you read easier to reuse later for writing, synthesis, or further study.

### AI as a thinking partner

- This section focuses on how AI is used inside Roam as a support layer for thinking, writing, and exploration.
- ![What The Little Mermaid Taught Us About Being Grown-Ups](https://i.pinimg.com/originals/65/a1/ef/65a1ef7205558d8ee606dcadd0891607.gif)
- The **Live AI issues pt0, pt1 and pt2** cover how AI operates directly on blocks, pages, and the graph itself, and because AI works on selected context or the graph, thinking stays anchored to your own material rather than starting from scratch.
- We also looked at how AI changes search and discovery inside large graphs. With tools like **Search+ and Roam Portal**, search is not limited to finding a specific block. You can filter by time, page, or structure, save searches, and step back to see how ideas develop and connect across months or years. This makes search part of the building process.
- ---
- Thank you all for this wonderful year!!! If you have ideas for features, suggestions, or need any help, send us a message: __support@roamresearch.com.__
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/8tvwyxDpCgPxKHLTWU1uvS/email)
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/3BhDZmV3i6cAhDaWuwshfy/email)

#### Commentarii Roamani: Roam Depot Gems: Roam Copilot -- [[January 10th, 2026]]

- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/hRnZLEqF15AAHYHGmHE6ZT)
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/qY2B1TuMuKimNvTAkikt66)
- We are starting 2026 by looking at Roam Copilot, an AI assistant that brings context-aware help into your Roam workspace.
- ---

## ♦️Roam Depot Gems: Roam Copilot♦️

#### How to set it up

- Go to Roam Depot and search for [Roam Copilot](https://github.com/qcrao/copilot) by [qcrao](https://github.com/qcrao). Install it.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/qK9JSinb8sWaatcfHANBYP/email)
- Then, in the settings, choose your AI provider. Find, copy, and paste your API key (using the given links)
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/oMwTAjpEKfbQF92F7XvTHN/email)
  - __there is a large range of options to pick from__
- Copilot is now installed! Open it from the lightbulb icon in the bottom-right corner and start a new chat.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/fH9RPq1s8qXufF46vTQ3T/email) ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/bkNm9KhrJAQGEmX4ppzGrQ/email)

#### How it works

- Roam Copilot reads the content of the page you are currently on, along with any blocks that are visible in the sidebar, and uses that combined context as the input for the model.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/aAXBFsk6kC6Ujx33W8cAQY/email)
- You interact with the model of your choice through a chat panel on the right side of your workspace, where you can ask questions, request summaries, generate outlines, explore arguments, develop ideas, etc... and the responses are grounded in the material that you opened and are looking at.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/3sHVXfM5RjvsxAkW45QWzP/email)
- One of the features that makes this extension so special is how intuitive and easy it is to use!
- You can start new conversations whenever you want, return to previous ones, and keep the panel minimized when you are not using it, so it stays available without getting in the way of your usual workflow.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/2qsYH243s9xnoi3iyc7g1B/email)
- Another thing that makes this tool so practical is the built-in templates, and the option to build your own custom templates.
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/pxrK9zzABMPVpggC7mEkuY/email)
- ![](https://embed.filekitcdn.com/e/vudzdYPdpXbwDanZpLkZZM/d4Sy3dtvbrW9W1Q179DBow/email)
- Roam Copilot is a very cool and promising addition to the Roam ecosystem (thanks [qcrao](https://github.com/qcrao)!), because it brings AI support directly into the graph and turns your intertwined notes and open context into something you can actively think with!
- More information is available on the Roam Copilot page in Roam Depot. If you try it, we’d love to hear how it fits into your workflow ☃️
- ---
- We hope you are all having a great beginning of 2026, join our slack channel [here](https://join.slack.com/t/roamresearch/shared_invite/zt-3n31y81xe-PVYEXT6rOmkT0f3oxWyTYA), and don't forget to check out [the Roam help graph](https://roamresearch.com/#/app/help/page/Ec97klr7x) for updates!
- ![This may contain: a group of snowmen are standing in the snow](https://i.pinimg.com/736x/1d/32/a3/1d32a395b5158eb7fd37b2276281dea7.jpg)
- __Happy 2026!__❄️
- 
