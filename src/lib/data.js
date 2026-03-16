/**
 * Creates a default follow-up entry for an arm at a given time point.
 * @param {string} timePoint
 */
export function createFollowUp(timePoint) {
  return {
    timePoint,
    discontinuedIntervention: null,
    discontinuedReasons: '',
    lostToFollowUp: null,
    lostToFollowUpReasons: ''
  }
}

/**
 * Creates a default arm.
 * @param {string} label
 * @param {string[]} timePoints
 */
export function createArm(label, timePoints) {
  return {
    label,
    allocation: {
      allocated: null,
      received: null,
      didNotReceive: null,
      didNotReceiveReasons: ''
    },
    followUp: timePoints.map(tp => createFollowUp(tp)),
    analysis: {
      analysed: null,
      excludedFromAnalysis: null,
      excludedReasons: ''
    }
  }
}

/**
 * Creates the default CONSORT diagram data for a 2-arm trial.
 */
export function createDefaultData() {
  const timePoints = ['']
  return {
    title: '',
    enrollment: {
      assessed: null,
      excluded: {
        total: null,
        notMeetingCriteria: null,
        declinedToParticipate: null,
        otherReasons: null,
        otherReasonsDetail: ''
      },
      randomised: null
    },
    arms: [
      createArm('Intervention', timePoints),
      createArm('Control', timePoints)
    ],
    followUpTimePoints: timePoints
  }
}

/**
 * Format a number for display, showing blank placeholder when null.
 * @param {number|null} n
 */
export function formatN(n) {
  return n != null ? `n = ${n}` : 'n = ___'
}
