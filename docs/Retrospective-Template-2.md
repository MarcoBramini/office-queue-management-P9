TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 3 stories done out of 5 stories committed 
- Total points committed vs done: 7 points done out of 17 committed
- Nr of hours planned vs spent (as a team): 55 hours spent out of 56

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| #0 | 3 | | 24 | 26.5|
|   S2109OQM-1     | 2       |    2   |      10      |        13     |
| S2109OQM-2     |       2  |      3  |       10     |       6.5       |
| S2109OQM-20    |  1       |  2      |      4        |    4         |
|  S2109OQM-6    | 1         |  3     |    4          | 1            | 
|    S2109OQM-7 |  1 | 1 | 4 | 4
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation): average =  5.7777777777778, standard deviation = 3.3259176771324
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 55/56 = 0.982

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 4
  - Total hours spent: 5
  - Nr of automated unit test cases: 14
  - Coverage (if available): 70%
- E2E testing:
  - Total hours estimated: 1
  - Total hours spent: 1
- Code review 
  - Total hours estimated: 4  
  - Total hours spent: 5
- Technical Debt management:
  - Total hours estimated 
  - Total hours spent
  - Hours estimated for remediation by SonarQube
  - Hours estimated for remediation by SonarQube only for the selected and planned issues 
  - Hours spent on remediation 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
  


## ASSESSMENT

- What caused your errors in estimation (if any)? The majority of us have never estimated tasks so we overestimated our velocity. We also underestimated time to get used (again) to technologies. We didn't plan properly the design of the application (simple frontend sketch and APIs details). 

- What lessons did you learn (both positive and negative) in this sprint? We need to plan in advance the application. We need to communicate more both before and during the development to align our work.

- Which improvement goals set in the previous retrospective were you able to achieve? This is our first retrospective.
  
- Which ones you were not able to achieve? Why? N/A

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

1) We should align our work through daily scrums.
2) We need to add a task related to planning.
3) We need to decide general conventions to write code easily understandable by everyone.

- One thing you are proud of as a Team!!
1) We work very hard and never give up. 
2) We can learn new thing really fast.
3) We solve internal conflicts (personal and code related) with calm. 
4) We used new technologies (heroku, mongoDB, mocha)
5) We helped each other