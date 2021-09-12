import { createSelector } from 'reselect'
import { AccountStatus, AgentStatus } from '@smartsupp/websocket-client'
import { State } from '../combinedReducers'
import { getSsWidget } from '../../utils/sdk'
import { filteredCorrectGroupAgents } from '../../utils/agentHelpers'
import { Agent } from '../../model/Agent'
import { userData } from '../general/selectors'

const visitorData = getSsWidget().options.visitorData || {}

export const allAgents = (state: State) => state.agent.agents
export const agents = createSelector(allAgents, userData, (a, userInfo) => {
	const nonDisabledAgents = a.filter(ag => !ag.disabled)

	return filteredCorrectGroupAgents(
		nonDisabledAgents,
		(visitorData && visitorData.group) || (userInfo && userInfo.visitor && userInfo.visitor.group),
	)
})

const connectedAgents = (state: State) => state.agent.connectedAgents
const joinedAgents = createSelector(connectedAgents, ag => ag.filter(a => !a.disabled))
const pureStatus = (state: State) => state.agent.status

export const status = createSelector(joinedAgents, pureStatus, (joined, pStatus) => {
	const oneOfAgentsIsOnlineHelper = (ag: Agent[]) =>
		ag.some(a => a.status === AgentStatus.Online) ? AccountStatus.Online : AccountStatus.Offline

	const oneOfJoinedAgentsIsOnline = oneOfAgentsIsOnlineHelper(joined)

	return joined.length > 0 ? oneOfJoinedAgentsIsOnline : pStatus
})

export const reversedJoinedAgents = createSelector(joinedAgents, items => [...items].reverse())

export const agentToShowInTrigger = createSelector(reversedJoinedAgents, agents, (joined, ags) => {
	const onlineAgents = ags.filter(ag => ag.status === AgentStatus.Online)
	const offlineAgents = ags.filter(ag => ag.status !== AgentStatus.Online)

	if (joined.length) {
		return joined[0]
	}

	if (onlineAgents.length) {
		return onlineAgents[Math.floor(Math.random() * onlineAgents.length)]
	}

	if (offlineAgents.length) {
		return offlineAgents[Math.floor(Math.random() * offlineAgents.length)]
	}

	return undefined
})
