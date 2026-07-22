# Release notes (daily-note updates from the help graph)

## July 21st, 2026

- {{[[search]]: white paper}}
- 

## July 17th, 2026

- {{[[pdf]]: https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FN8flz2wX1D.pdf?alt=media&token=234bb817-9b2c-4317-846e-9ce2f0b66eb1}}

## July 16th, 2026

- 

## April 1st, 2026

- dsagj da
  - dsaj dag 
- dashj dsag kjsda
  - dsanj kdsah dsbaj k
  - dabsj sdag jbksda
  - dsaj khsag jdas
  - gsda jkh dsjkdsa
  - h ajsdg dsa
  - dsanj kdsah
  - j kdas

## March 24th, 2026

- 

## March 15th, 2026

- test [[March 15th, 2026]]

## January 22nd, 2026

- 19:13 - 20:57
- 20:57 - 

## January 2nd, 2026

- 

## June 21st, 2025

- [[Quality of Life Improvements]]
  - Fix selecting blocks with the mouse when the blocks are aligned horizontally, such as with the horizontal [[block view]] or with css
  - Auto scroll the page when selecting blocks with the mouse

## May 24th, 2025

- 

## March 7th, 2025

- 
- {{[[query]]: "Query bug fixes"  {and: [[Query]] [[Bug Fixes]]}}}
- 

## February 27th, 2025

- 
- 

## February 20th, 2025

- 

## January 8th, 2025

- 

## June 17th, 2024

- 

## June 14th, 2024

- 

## June 11th, 2024

- 

## September 19th, 2023

- [[Change Log]]

## May 9th, 2023

- 

## March 3rd, 2023

- 

## February 10th, 2023

- [[Project: 30 Demos in 6 Weeks]]
  - {{[[DONE]]}} [[Experiment]] - Demo how it was possible to use the combination of [[roam/render]] and [[roam/templates]] to create a **factory template** the creates customizable dropdowns which add block-refs to a selected item from a particular list.
    - Video
      - {{[[video]]: https://www.loom.com/share/1adf78d01db9435fb69bf4249a296a66}}
    - To use 
      - {{[[TODO]]}} copy this block into your graph #.bp3-card
        - **Conor's [[Factory Template]] for creating Option Dropdowns based on block refences  #[[roam/templates]]**
          - Congratulations! You have just created a new **Dropdown Template** 
            - #.rm-g  #.rm-h 
              - {{[[TODO]]}} Edit the block below to change the template
                - [[RM/Component/Select]] an item from Dropdown List [[roam/templates]]
                  - {{[[roam/render]]: ```clojure
                    (ns niki.dropdown
                      (:require
                        [clojure.string :as str]
                        [roam.block :as block]
                        [roam.datascript.reactive :as dr]))

                    (defn replace-with-block-ref [block-uid opts-uid ref-uid]
                      (let [before (->> [:block/uid block-uid]
                                     (dr/pull [:block/string])
                                     (deref)
                                     :block/string)
                            pattern (re-pattern
                                      (str
                                        "\\{\\{"
                                        "(?:\\[\\[)?roam/render(?:\\]\\])?:" ;; [[roam/render]]
                                        "\\s*"
                                        "\\(\\(([a-zA-Z0-9-]+)\\)\\)"        ;; render code block
                                        "\\s*"
                                        "\\(\\((" opts-uid ")\\)\\)"         ;; options block
                                        "\\s*"
                                        "(\\(\\(([a-zA-Z0-9-]+)\\)\\))?"     ;; selected block
                                        "\\}\\}"))
                            after   (str/replace before pattern
                                      (str "{{[[roam/render]]: (($1)) (($2)) ((" ref-uid "))}}"))]
                        (block/update
                          {:block
                           {:uid block-uid 
                            :string after}})))

                    (defn view-children-clickable [block-uid opts-uid selected-uid]
                      (let [children (->> [:block/uid opts-uid]
                                       (dr/pull [{:block/children [:block/uid :block/string]}])
                                       deref
                                       :block/children)]
                        [:select {:id opts-uid
                                  :on-change #(replace-with-block-ref block-uid opts-uid (-> % .-target .-value))}
                         (for [c children]
                           [:option
                            {:value    (:block/uid c)
                             :selected (= (:block/uid c) selected-uid)
                             :on-change #(replace-with-block-ref (:block/string c))}
                            (:block/string c)])]))

                    (defn main [{:keys [block-uid]} [_ opts-uid] & [[_ selected-uid]]]
                      [view-children-clickable block-uid opts-uid selected-uid])``` Dropdown List}}
              - {{[[TODO]]}} Edit these blocks to change the items visible in the dropdown
                - Dropdown List
                  - A
                  - B
                  - C
          - {{[[TODO]]}}  Apply the template #.rm-E 
            - {{[[TODO]]}} type `;;`   
            - {{[[TODO]]}} search for the label you've given it here -> 
            -  This will produce a custom Select Component like this one 
              - {{[[roam/render]]: ```clojure
                (ns niki.dropdown
                  (:require
                    [clojure.string :as str]
                    [roam.block :as block]
                    [roam.datascript.reactive :as dr]))

                (defn replace-with-block-ref [block-uid opts-uid ref-uid]
                  (let [before (->> [:block/uid block-uid]
                                 (dr/pull [:block/string])
                                 (deref)
                                 :block/string)
                        pattern (re-pattern
                                  (str
                                    "\\{\\{"
                                    "(?:\\[\\[)?roam/render(?:\\]\\])?:" ;; [[roam/render]]
                                    "\\s*"
                                    "\\(\\(([a-zA-Z0-9-]+)\\)\\)"        ;; render code block
                                    "\\s*"
                                    "\\(\\((" opts-uid ")\\)\\)"         ;; options block
                                    "\\s*"
                                    "(\\(\\(([a-zA-Z0-9-]+)\\)\\))?"     ;; selected block
                                    "\\}\\}"))
                        after   (str/replace before pattern
                                  (str "{{[[roam/render]]: (($1)) (($2)) ((" ref-uid "))}}"))]
                    (block/update
                      {:block
                       {:uid block-uid 
                        :string after}})))

                (defn view-children-clickable [block-uid opts-uid selected-uid]
                  (let [children (->> [:block/uid opts-uid]
                                   (dr/pull [{:block/children [:block/uid :block/string]}])
                                   deref
                                   :block/children)]
                    [:select {:id opts-uid
                              :on-change #(replace-with-block-ref block-uid opts-uid (-> % .-target .-value))}
                     (for [c children]
                       [:option
                        {:value    (:block/uid c)
                         :selected (= (:block/uid c) selected-uid)
                         :on-change #(replace-with-block-ref (:block/string c))}
                        (:block/string c)])]))

                (defn main [{:keys [block-uid]} [_ opts-uid] & [[_ selected-uid]]]
                  [view-children-clickable block-uid opts-uid selected-uid])``` Dropdown List}} 
              - built off this  Dropdown List
          - This component is an experiment, and was built paritally as a demo of what you can do with  [[roam/render]] - a feature of roam that allows you to build interactive components out of code blocks written __inside__ your roam graph and referenced by the component in this format `{{[[roam/render]]: ((id for the code block goes here)) }}` 
            - If you'd like to edit the code for the template - you can edit it here
              - ```clojure
                (ns niki.dropdown
                  (:require
                    [clojure.string :as str]
                    [roam.block :as block]
                    [roam.datascript.reactive :as dr]))

                (defn replace-with-block-ref [block-uid opts-uid ref-uid]
                  (let [before (->> [:block/uid block-uid]
                                 (dr/pull [:block/string])
                                 (deref)
                                 :block/string)
                        pattern (re-pattern
                                  (str
                                    "\\{\\{"
                                    "(?:\\[\\[)?roam/render(?:\\]\\])?:" ;; [[roam/render]]
                                    "\\s*"
                                    "\\(\\(([a-zA-Z0-9-]+)\\)\\)"        ;; render code block
                                    "\\s*"
                                    "\\(\\((" opts-uid ")\\)\\)"         ;; options block
                                    "\\s*"
                                    "(\\(\\(([a-zA-Z0-9-]+)\\)\\))?"     ;; selected block
                                    "\\}\\}"))
                        after   (str/replace before pattern
                                  (str "{{[[roam/render]]: (($1)) (($2)) ((" ref-uid "))}}"))]
                    (block/update
                      {:block
                       {:uid block-uid 
                        :string after}})))

                (defn view-children-clickable [block-uid opts-uid selected-uid]
                  (let [children (->> [:block/uid opts-uid]
                                   (dr/pull [{:block/children [:block/uid :block/string]}])
                                   deref
                                   :block/children)]
                    [:select {:id opts-uid
                              :on-change #(replace-with-block-ref block-uid opts-uid (-> % .-target .-value))}
                     (for [c children]
                       [:option
                        {:value    (:block/uid c)
                         :selected (= (:block/uid c) selected-uid)
                         :on-change #(replace-with-block-ref (:block/string c))}
                        (:block/string c)])]))

                (defn main [{:keys [block-uid]} [_ opts-uid] & [[_ selected-uid]]]
                  [view-children-clickable block-uid opts-uid selected-uid])```

## August 15th, 2022

- {{embed-path: [[August 15th, 2022]]}}

## June 13th, 2022

- 

## May 13th, 2022

- 

## February 3rd, 2022

- 

## January 24th, 2022

- 

## October 29th, 2021

- {{[[query]]: {and: [[ex-A]] [[ex-B]]}}}

## October 7th, 2021

- [[October 7th, 2021]]
  - [[Quality of Life Improvements]]
    - Fix [[autocomplete]] appearing offscreen in [[embed]]s, the [[Right Sidebar]] and [[mobile]]
      - [[embed]]
        - **before**
          - Autocomplete gets "trapped" inside of the embed
          - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2Fl-yBff_stw.png?alt=media&token=72683948-7ebc-440c-8bd6-0e34aff4a8bd)
          - and scrolls the embed, which sometimes leads to the embed getting stuck
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FVobJ470b9-.png?alt=media&token=1d4a2e9a-9b1e-401f-8182-12b962a5bfb0)
        - **after**
          - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Froamteam%2FdfjnNdt-Xv.png?alt=media&token=6a134550-fb43-4035-bfb3-fa5fdc74f840)
      - [[Right Sidebar]]
        - **before**
          - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2F0jSiiGlMdB.png?alt=media&token=b1a96c21-c829-411c-b49b-bc3d51833fa7)
          - also sometimes led to a similar issue as with embeds, where the sidebar got stuck offscreen
        - **after**
          - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FI8GsnHl0hB.png?alt=media&token=c7a6d654-5135-4168-8f4f-c88d6ae9993f)
      - [[mobile]]
        - **before**
          - Autocomplete causes the whole screen to scroll to the right
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2Fj5Gk-J5ayh.png?alt=media&token=e6246ae0-ebdc-4fe2-9283-522f0f22be1e)
        - **after**
          - Autocomplete adjusts to fit the size of the screen
            - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FPBNQMc-v1S.png?alt=media&token=c977b686-2179-4627-8324-55867e264010)

## October 1st, 2021

- 

## September 28th, 2021

- [[September 28th, 2021]]
  - **[[Quality of Life Improvements]] ✨**
    - All settings, including keyboard shortcut customizations accessible from [[Command Palette]] 
      - `cmd-p` on [[Mac]]
      - `control-p` on [[Windows]] or [[Linux]]
      - __handy way to discover or remember different keyboard shortcuts__
      - Example::
        - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fhelp%2FBykG_v_8KV.png?alt=media&token=76c76dce-6346-4b6e-9435-843f07219956)

## September 27th, 2021

- 
  - [[Quality of Life Improvements]] ✨
    - Added a shortcut (`Cmd/Ctrl+Opt+R`) to toggle [[Youtube]] [[Videos]] playback while typing in a block
    - Made [[Video Timestamps]] look a little nicer
  - [[Bug Fixes]]  🛠
    - Fixed bug that caused Roam to crash when [[Query]] using `between` contained only one date

## September 21st, 2021

- [[September 21st, 2021]]
  - [[Customization]] #[[End User Programming]] #[[Quality of Life Improvements]]
    - Custom components in [[JSX]] and [[Javascript]]
    - {{[[video]]: https://grain.co/highlight/NkzVPjnoX3P8gavWAVq9g00DiABYGCE1gWZIU63J}}
    - [[Example]]
      - {{[[video]]: https://grain.co/highlight/2xiEAKKj5It1deDSFzbwWMbm3JXLwqt0OdtzmQ53}}

## September 18th, 2021

- [[September 18th, 2021]]
  - [[Customization]] [[Improvements]]
    - Styling changes applied to blocks via `#.style-tags-like-this` now propogate to references of those blocks red #.bg-red-500  #.text-white , white and blue #.bg-blue-500 #.text-white 
      - white
      - blue #.bg-blue-500 #.text-white 
      - red #.bg-red-500  #.text-white 
    - Propogates many levels up too -- see ((Styling changes applied to blocks via `#.style-tags-like-this` now propogate to references of those blocks red #.bg-red-500  #.text-white , white and blue #.bg-blue-500 #.text-white )) 

## July 21st, 2021

- [[Roam Depot]]
  - https://twitter.com/RoamResearch/status/1550192726540374016?s=20&t=qEEBfrUN4jkSq9qSt5HDAQ
  - [[PhonetoNote]]
    - https://twitter.com/phonetonote/status/1551764556707397633?s=20&t=qEEBfrUN4jkSq9qSt5HDAQ
  - [[Matter]]
    - https://twitter.com/matter/status/1549490849595080704?s=20&t=qEEBfrUN4jkSq9qSt5HDAQ
- 

## June 11th, 2021

- 

## June 1st, 2021

- 

## May 30th, 2021

- 

## May 25th, 2021

- 

## May 10th, 2021

- 

## April 22nd, 2021

- 

## April 20th, 2021

- 

## April 17th, 2021

- 

## April 16th, 2021

- 

## April 11th, 2021

- 
- 

## April 8th, 2021

- 

## April 3rd, 2021

- Good morning! Today's a great day to test out the mobile interface! :)
- Indenting is cool. But I don't foresee anyone 
  - Ever moving their stuff using these icons. But I might.  Be wrong. The thing is that the menu bar thing doesn't scroll properly, which makes everything clunky.
  - Some low hanging fruits would be, to replace drawing with TODOs and add one more icon in there, probably for [[Bidirectional linking]]

## April 2nd, 2021

- 

## April 1st, 2021

- 

## March 31st, 2021

- 

## March 27th, 2021

- Import
  - [[February 8th, 2021]]
    - From: February 8th, 2021.json

## March 26th, 2021

- 

## March 25th, 2021

- https://twitter.com/Conaw/status/1375280053882253313?s=20
  - https://twitter.com/Conaw/status/1375287978482835468?s=20
- [[Essay]] - [[Why you can't say]] [[Kevin Lacker]]
  - Response to:: [[Essay]] [[What You Can't Say]] [[Paul Graham]]
  - [[Tangent]]
    - See {{iframe:https://en.m.wikipedia.org/wiki/Social_constructionism}} 
      and the idea of [[Roam Browser]] [[Electron App]]
      - When you visit the page - you could have an easy indicator -- like highlighting things from the page - (to pull into your Roam -- or spending a certain amount of time on it -- or a [[30ms Gesture]] like a moving the mouse in a pattern, or hitting a super easy keyboard shortcut -- and have the page be sent to [[ArWeave]] or [[Internet Archive]])
        - {{[[TODO]]}} Learn more about [[ArWeave]] -- catchup with [[Mek]] and [[Gerben]] and see what the current state of [[Web Archival]] is
          - it's been a few years -- but linkrot is huge problem - and one we should have easy answer for -- also could have options for global registries of these (or ipfs content hash the contnets (though content hash maybe maybe maybe has security concerns (probably moot if we have e2ee and you can choose what archival services you use...)))

## March 24th, 2021

- 

## March 14th, 2021

- 

## March 13th, 2021

- 

## March 6th, 2021

- 

## March 5th, 2021

- 

## March 4th, 2021

- 

## March 3rd, 2021

- 

## February 8th, 2021

- 
- [[Hiring]] [[Work at Roam]] [[Clojure Engineer]] - [[Backend Role]] [[Take Home Project]]
  - {{[[TODO]]}} Given a map, or a [datascript](https://github.com/tonsky/datascript) database at two points in time
  - {{[[TODO]]}} Generate a diff of the two structures
  - {{[[TODO]]}} Generate the minimal transaction which will bring A -> B, and vice versa.
  - #Bonus 
    - {{[[TODO]]}} Given a set of User-Events which map to certain transactions - find the sequence of user events which brought A -> B, or which would bring B -> A
    - {{[[TODO]]}} Take a roam outline tree, and create a datascript DB with just the data contained within it  - such as this one This item
    - {{[[TODO]]}} Publish your code and the demo on a roam graph using `roam/render` and custom components
      - Roam allows you to write arbitrary CLJS code - and evaluate it in your graph - you can use this code - and the roam Alpha API to query your graph, and create mutations for it.
      - Submit your answer as a roam-graph
      - All code should be in the same Roam Graph as the working demo.
      - {{[[roam/render]]: ```clojure
        (ns starting-point-for-custom-roam
          (:require
           [reagent.core :as r]
           [datascript.core :as d]
           [roam.datascript.reactive :as dr]))

        (defn x [{b :block-uid} x]
          	[:div.bp3-card 
             [:ul
             [:li (pr-str @(dr/pull '[:block/string {:block/children ...}
                                      :block/uid 
                                      ] x))]
              [:li [:h3"Schema" ]
               (pr-str @(dr/q 
                             '[:find [?a ...]
                               :where [_ ?a _]]))]
             [:li (pr-str (keys @(dr/pull '[*] [:block/uid b])))]]]
          )``` This item}}
        - ```clojure
          (ns starting-point-for-custom-roam
            (:require
             [reagent.core :as r]
             [datascript.core :as d]
             [roam.datascript.reactive :as dr]))

          (defn x [{b :block-uid} x]
            	[:div.bp3-card 
               [:ul
               [:li (pr-str @(dr/pull '[:block/string {:block/children ...}
                                        :block/uid 
                                        ] x))]
                [:li [:h3"Schema" ]
                 (pr-str @(dr/q 
                               '[:find [?a ...]
                                 :where [_ ?a _]]))]
               [:li (pr-str (keys @(dr/pull '[*] [:block/uid b])))]]]
            )```
      - This item
        - Has children
          - Abcd
          - B
          - C
    - **IF you want to also be considered for  #[[UI Engineer]]**
      - {{[[TODO]]}}  generate a UI for displaying the diff 
      - {{[[TODO]]}} create a simple component that will let you save the state of a block subtree at various points, and return to these states - by firing new transactions
- Import
  - [[December 1st, 2020]]
    - From: December 1st, 2020.json

## February 1st, 2021

- {{[[TODO]]}} Have a [[meeting]] with [[John Smith]] about [[Roam Research]] on [[February 8th, 2021]]. #marketing

## January 1st, 2020

- 

