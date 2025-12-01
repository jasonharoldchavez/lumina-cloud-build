SYMBOLS = {"Ω":"Origin","Ξ":"Transition","∇":"Flow","3":"Intent","6":"Alignment","9":"Completion"}

class Plugin:
    def __init__(self):
        pass

    def _nearest(self, value):
        if value < 3.5: return "3"
        if value < 6.5: return "6"
        return "9"

    def predict(self, vec, penalty, state, log):
        try:
            s1 = self._nearest(vec[0])
            s2 = self._nearest(vec[1])
            s3 = self._nearest(vec[2])
            chain = f"{s1}-{s2}-{s3}"
            log(f"[SYMBOLIC] chain={chain} state={state} penalty={penalty.total}")
        except Exception as e:
            log(f"[SYMBOLIC_ERROR] {e}")
