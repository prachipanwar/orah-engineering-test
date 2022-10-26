import React, { useState } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"


interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
  studentCount:{count?:number}
}
var present = 0;
var late = 0;
var absent=0;

export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange,studentCount }) => {
  const [rollState, setRollState] = useState(initialState)
  const [rollCount, setRollCount] = React.useState<{ presentCount?: number, lateCount?: number,absentCount?:number }>({
    presentCount: 0,
    lateCount: 0,
    absentCount:studentCount.count

  });
  const [absentState,setAbsentState]= React.useState(studentCount.count)
  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    const next = nextState()
    console.log("state is changed", rollState, next)
    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
    if (next === "present") {
      present = present + 1
      // absent = absentState - (present + late)

      const obj3 = Object.keys(rollCount).map((key:string)=>{
        // rollCount[key] = Number(rollCount[key]+1) ;
        console.log(rollCount["absentCount"])
      });
    
       setRollCount({ presentCount: present, lateCount: rollCount.lateCount,absentCount:rollCount.absentCount })
      // setRollCount((prevState:any)=>{
      //   presentCount=prevState["presentCount"]-1,
      //   absentCount=rollCount.absentCount-1
      // })
    }
    if (next === "late") {
      late = late + 1
      present = present - 1
      setRollCount({ presentCount: present, lateCount: late,absentCount:rollCount.absentCount  })
    }
    if(next==="absent"){
      absent=absent+1
      setRollCount({presentCount: rollCount.presentCount, lateCount: rollCount.lateCount,absentCount:absent  })

    }


  }
  console.log("Roll Count",rollCount)


  return (
    <RollStateIcon type={rollState} size={size} onClick={onClick} rollCount={rollCount}/>
  )
}
