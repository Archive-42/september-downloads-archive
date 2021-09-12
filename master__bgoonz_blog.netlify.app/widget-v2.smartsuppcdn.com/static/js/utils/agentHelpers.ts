import { SimpleAgent } from '@smartsupp/websocket-client'
import { Agent } from '../model/Agent'
import { mapAgentFromServerToLocal } from './messageHelpers'

export const getAgentFromArray = (agents: Agent[], agentId: string | null) => agents.find(a => a.id === agentId)

export const filteredCorrectGroupAgents = (agents: Agent[], groupFromSite: string | undefined | null): Agent[] => {
	if (groupFromSite) {
		if (groupFromSite === 'default') {
			return agents
		}

		return agents.filter(
			a => (a.groups && a.groups.length > 0 && a.groups.includes(groupFromSite)) || (a.groups && a.groups.length === 0),
		)
	}
	return agents
}

export const filterConnectedAgents = (assignedIds: string[] | undefined | null, agents: SimpleAgent[]) => {
	const connectedAgents = [] as SimpleAgent[]

	if (assignedIds && assignedIds.length) {
		assignedIds.map(element => {
			const foundAgent = agents.find(a => a.id === element)
			return foundAgent && connectedAgents.push(foundAgent)
		})
		return connectedAgents.map(mapAgentFromServerToLocal)
	}
	return []
}
