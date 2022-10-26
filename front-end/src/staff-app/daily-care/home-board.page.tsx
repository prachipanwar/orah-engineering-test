import React, { useState, useEffect, FunctionComponent, PropsWithChildren } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import Switch from '@mui/material/Switch';
// import {styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { faSortAlphaUp, faSortAlphaDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import TextField from '@mui/material/TextField';
import { RolllStateType } from "shared/models/roll"

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
}
var present = 0
export const HomeBoardPage: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange }) => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [AscArr, setAscArr] = React.useState<
    Array<{
      id: number,
      first_name: string,
      last_name: string;
    }>
  >([])
  const [descArr, setDescArr] = React.useState<
    Array<{
      id: number,
      first_name: string,
      last_name: string;
    }>
  >([])
  const [checked, setChecked] = React.useState(true);
  const [switchLabel, setSwitchLabel] = React.useState('First Name');
  const [studentCount, setStudentCount] = React.useState<{ count?: number }>({
    count: 0
  });
  // const [rollState, setRollState] = useState(initialState)
  // const [rollCount, setRollCount] = React.useState<{ presentCount?: number }>({
  //   presentCount: 0
  // });
  // const nextState = () => {
  //   const states: RolllStateType[] = ["present", "late", "absent"]
  //   if (rollState === "unmark" || rollState === "absent") return states[0]
  //   const matchingIndex = states.findIndex((s) => s === rollState)
  //   return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  // }
  // const onCircleClick = () => {
  //   const next = nextState()
  //   setRollState(next)
  //   if (onStateChange) {
  //     onStateChange(next)
  //   }
  //   if (next === "present") {
  //     present = present + 1
  //     setRollCount({ presentCount: present })

  //   }

  // }
  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
      const totalCount = data?.students.length
      setStudentCount({ count: totalCount })
    }
  }
  const onSwitchAction = () => {
    if (checked === true) {
      setChecked(false);
      setSwitchLabel('Last Name')
    }
    else {
      setChecked(true);
      setSwitchLabel('First Name')
    }
  };
  const searchByName = (event: any) => {
    if (event.key === "Enter") {
      console.log("searchhere", event)
    }

  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const sortAscOrder = () => {
    if (checked === true) {

      const sorted = data?.students.sort((a, b) => a.first_name > b.first_name ? 1 : -1,)

      setAscArr((sorted) => [...sorted]);
      // setAscArr((sorted:[]) =>  sorted )
    }
    else {
      const sorted = data?.students.sort((a, b) => a.last_name > b.last_name ? 1 : -1,)

      setAscArr((sorted) => [...sorted]);
      // setAscArr((sorted:[]) =>  sorted )
    }

  }
  const sortDescOrder = () => {
    if (checked === true) {

      const sorted = data?.students.sort((a, b) => a.first_name > b.first_name ? -1 : 1,)

      setDescArr((sorted) => [...sorted]);
      // setAscArr((sorted:[]) =>  sorted )
    }
    else {

      const sorted = data?.students.sort((a, b) => a.last_name > b.last_name ? -1 : 1,)

      setDescArr((sorted) => [...sorted]);
      // setAscArr((sorted:[]) =>  sorted )
    }

  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} sortAscOrder={sortAscOrder} sortDescOrder={sortDescOrder} switchAction={onSwitchAction} switchLabel={switchLabel} checked={checked} searchByName={searchByName}
        />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {/* {AscArr.map((s)=>(
  <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
))} */}


        {loadState === "loaded" && data?.students && (
          <>
            {data.students.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} studentCount={studentCount} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} studentCount={studentCount}  />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void,
  switchAction: () => void,
  switchLabel: string,
  checked: boolean,
  // search:string
  searchByName: (value?: string) => void,
  // setAscArr: React.Dispatch<React.SetStateAction<any>>;
  sortAscOrder: () => void,
  sortDescOrder: () => void,

}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, switchAction } = props
  // const [checked, setChecked] = React.useState(true);
  // const [switchLabel, setSwitchLabel] = React.useState('First Name');
  // const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" });
  // const [AscArr,setAscArr] = useState<{id: number; first_name: string;last_name:string;}[]>(
  //   [],)





  return (
    <S.ToolbarContainer>
      <S.subContainer>
        <FormGroup>
          <FormControlLabel control={<Switch checked={props.checked} onChange={() => switchAction()} color="primary" />}
            label={props.switchLabel} />
        </FormGroup>
        <S.sortIcons >
          <FontAwesomeIcon icon={faSortAlphaUp} title="Sort up" size="2x" onClick={() => props.sortAscOrder()} />
        </S.sortIcons>
        <S.sortIcons>
          <FontAwesomeIcon icon={faSortAlphaDown} title="Sort down" size="2x" onClick={() => props.sortDescOrder()} />
        </S.sortIcons>
      </S.subContainer>
      <S.subContainerSearch>
        <TextField id="standard-basic" label="Search" color="primary" variant="standard" />
        {/* onKeyDown={(item)=>props.searchByName(props.search)} */}
        <S.searchIcon>
          <FontAwesomeIcon icon={faSearch} size="1x"></FontAwesomeIcon>
        </S.searchIcon>

      </S.subContainerSearch>

      <S.roleContainer>
        <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
      </S.roleContainer>

    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    /* color: #fff; */
    background-color: white;
    padding: 6px 5px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
      color: white;
      background-color: #1976D2;
      width: 90px
    }
  `,
  subContainer: styled.div`
  width: 40%;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`,
  sortIcons: styled.div`
cursor: pointer;
color: #1976D2;
`,
  subContainerSearch: styled.div`
  width: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`,
  searchIcon: styled.div`
position: absolute;
    right: 22px;
    bottom: 10px;
    color: #1976D2;
`,
  roleContainer: styled.div`
width: 30%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`,

}
