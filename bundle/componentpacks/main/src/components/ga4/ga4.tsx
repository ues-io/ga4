import { useEffect } from "react"
import { api, UC } from "@uesio/ui"
import get from "lodash/get"

import ReactGA from "react-ga4"

type ComponentDefinition = {
	consent?: {
		componentType: string
		componentId: string
		propertyPath: string
	}
}

const Ga4: UC<ComponentDefinition> = ({ context, definition }) => {
	const path = context.getRoute()?.path

	const { consent } = definition

	const MEASUREMENT_ID = api.view.useConfigValue("uesio/ga4.measurement_id")

	const consentState = api.component.useExternalState(
		api.component.makeComponentId(
			context,
			consent?.componentType,
			consent?.componentId
		)
	)

	const hasConsent = consent
		? !!get(consentState, consent?.propertyPath)
		: true

	useEffect(() => {
		if (!MEASUREMENT_ID || !hasConsent) {
			return
		}
		ReactGA.initialize(MEASUREMENT_ID)
		ReactGA.send({
			hitType: "pageview",
			page: path,
		})
	}, [MEASUREMENT_ID, path, hasConsent])

	return null
}

export default Ga4
