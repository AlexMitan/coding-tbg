# coding-tbg
Another approach at a coding game: a turn-based tactics one.

## Roadmap:

- [x] basic classes
    - [x] unit
        - [x] attrs
        - [x] attack()
    - [x] squad
    - [ ] ability
- [ ] squads
- [ ] two-squad random fight
    - [x] with basic units
- [ ] two-squad tactical fight
    - [ ] with basic units
- [x] tree-based game model
    - [x] all game objects are subtrees
    - [x] event/message system
- [ ] iterator-based game model, multi-step actions
    - [ ] basic AP simulation
    - [ ] state interruptions
    - [ ] integrate with Jini or some AI model
- [x] graphics for two-squad fight
    - [x] npm setup
    - [x] canvas integration with tree architecture
    - [ ] d3 setup
    - [ ] d3 multicluster thing
    - [x] tie-in with basic model
    - [ ] tie-in with architecture
- [ ] create the Jini language
    - [ ] Lox-inspired syntax
    - [ ] lexer
    - [ ] parser
- [ ] code parsing for two-squad fight

## Future plans:

- [x] fully tree-like architecture: world-squad-unit
