// Preserve class-based starters while accepting an equivalent standalone function.
// Resolve each case independently so Solution instances never share test state.
export const pythonCallHelper=`
def _aa_call_solution(name, args):
    solution = globals().get('Solution')
    if solution is not None:
        if not isinstance(solution, type):
            raise ValueError('Solution must be a class. Alternatively, remove it and define a top-level function named ' + name + '.')
        target = getattr(solution(), name, None)
        if not callable(target):
            raise ValueError('Solution must define the method ' + name + '. Keep the function name shown in the starter.')
    else:
        target = globals().get(name)
        if not callable(target):
            raise ValueError('Define class Solution with method ' + name + ', or a top-level function def ' + name + '(...) without self. Your draft has not been changed.')
    return target(*args)
`;
